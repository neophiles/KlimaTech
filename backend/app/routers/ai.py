import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.db import get_session
from app.models import Barangay
from datetime import datetime, timedelta, timezone
from app.utils.heat_index import calculate_heat_index
import httpx
import os
import cohere

router = APIRouter(prefix="/ai", tags=["AI Suggestions"])

co = cohere.ClientV2(api_key=os.getenv("COHERE_API_KEY"))

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
PH_TZ = timezone(timedelta(hours=8))

@router.post("/barangays/{barangay_id}/suggestions")
async def get_ai_task_suggestions(barangay_id: int, body: dict, session: Session = Depends(get_session)):
    """
    Request body example:
    {
        "tasks": [
            {"task": "Jog at the park", "time": "07:00"},
            {"task": "Hang laundry", "time": "14:00"},
            {"task": "Grocery shopping", "time": "17:30"}
        ]
    }
    """

    # Validate barangay
    barangay = session.get(Barangay, barangay_id)
    if not barangay:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barangay not found")

    # Fetch today's forecast
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": barangay.lat,
            "longitude": barangay.lon,
            "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "uv_index"],
            "timezone": "Asia/Manila"
        }
        r = await client.get(OPEN_METEO_URL, params=params)
        forecast_data = r.json()

    times = forecast_data["hourly"]["time"]
    temps = forecast_data["hourly"]["temperature_2m"]
    hums = forecast_data["hourly"]["relative_humidity_2m"]
    uvs = forecast_data["hourly"]["uv_index"]

    today = datetime.now(PH_TZ).date()
    today_forecast = [
        {
            "time": t,
            "temperature": temps[i],
            "humidity": hums[i],
            "uv_index": uvs[i],
            "heat_index": calculate_heat_index(temps[i], hums[i])[0],
            "risk_level": calculate_heat_index(temps[i], hums[i])[1]
        }
        for i, t in enumerate(times)
        if datetime.fromisoformat(t).date() == today
    ]

    # AI context
    user_tasks = body.get("tasks", [])
    forecast_summary = json.dumps(today_forecast[:8], indent=2)
    tasks_json = json.dumps(user_tasks, indent=2)

    message = f"""
    You are a concise weather advisor for outdoor activities in the Philippines.
    Based on the following hourly forecast and user tasks, give short actionable advice per task.

    Forecast data (today):
    {forecast_summary}

    User's planned tasks:
    {tasks_json}

    Respond in JSON:
    [
      {{
        "task": "<task name>",
        "time": "<time>",
        "suggestion": "<short advice, ≤15 words>"
      }}
    ]
    """

    # Call Cohere’s Chat API
    response = co.chat(
        model="command-a-03-2025",  # Updated to valid model
        messages=[
            {"role": "user", "content": message}
        ],
        temperature=0.4,
        max_tokens=300
    )

    # Extract model response
    text = response.message.content[0].text.strip()

    try:
        ai_suggestions = json.loads(text)
    except json.JSONDecodeError:
        ai_suggestions = [{"task": t["task"], "time": t["time"], "suggestion": text} for t in user_tasks]

    return {
        "barangay": barangay.barangay,
        "tasks": ai_suggestions,
        "raw_ai_response": text
    }
