from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from app.db import get_session
from app.models import Barangay, HeatLog
from app.schemas.task_suggestions import TaskInput, TaskSuggestion
from app.utils.heat_index import calculate_heat_index
import cohere
import os
from datetime import datetime, timedelta, timezone
import httpx

router = APIRouter(prefix="/suggestions", tags=["AI Suggestions"])

PH_TZ = timezone(timedelta(hours=8))
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.ClientV2(api_key=COHERE_API_KEY)
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


async def get_today_forecast_for_barangay(barangay: Barangay):
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": barangay.lat,
            "longitude": barangay.lon,
            "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "uv_index"],
            "timezone": "Asia/Manila"
        }
        r = await client.get(OPEN_METEO_URL, params=params)
        r.raise_for_status()
        data = r.json()

    times = data["hourly"]["time"]
    temps = data["hourly"]["temperature_2m"]
    hums = data["hourly"]["relative_humidity_2m"]
    winds = data["hourly"]["wind_speed_10m"]
    uvs = data["hourly"]["uv_index"]

    today = datetime.now(PH_TZ).date()
    forecast = []
    for i in range(len(times)):
        dt = datetime.fromisoformat(times[i])
        if dt.date() == today:
            hi, risk = calculate_heat_index(temps[i], hums[i])
            forecast.append({
                "time": dt,
                "temperature": temps[i],
                "humidity": hums[i],
                "wind_speed": winds[i],
                "uv_index": uvs[i],
                "heat_index": hi,
                "risk_level": risk
            })

    return forecast


@router.post("/", response_model=list[TaskSuggestion])
async def generate_task_suggestions(data: TaskInput, session: Session = Depends(get_session)):
    try:
        barangay = session.get(Barangay, data.barangay_id)
        if not barangay:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barangay not found")

        # Get today's hourly forecast
        forecast = await get_today_forecast_for_barangay(barangay)

        if forecast:
            weather = {
                "barangay": barangay.barangay,
                "province": barangay.province,
                "temperature": forecast[0]["temperature"] if forecast else "-",
                "humidity": forecast[0]["humidity"] if forecast else "-",
                "uv_index": forecast[0]["uv_index"] if forecast else "-",
                "heat_index": forecast[0]["heat_index"] if forecast else "-",
                "risk_level": forecast[0]["risk_level"] if forecast else "-"
            }

        else:
            weather = {
                "barangay": barangay.barangay_name,
                "province": barangay.province_name,
                "temperature": "-",
                "humidity": "-",
                "uv_index": "-",
                "heat_index": "-",
                "risk_level": "-"
            }

        # Match each task to its closest forecast hour
        task_contexts = []
        for t in data.tasks:
            try:
                task_time = datetime.strptime(t.time, "%H:%M").time()
                if forecast:
                    closest = min(forecast, key=lambda f: abs(f["time"].time().hour - task_time.hour))
                    context = (
                        f"{t.task} at {t.time} -> "
                        f"{closest['temperature']}°C, humidity {closest['humidity']}%, "
                        f"UV index {closest['uv_index']}, heat index {closest['heat_index']}°C "
                        f"({closest['risk_level']})"
                    )
                else:
                    context = f"{t.task} at {t.time} → (no forecast data found)"
                task_contexts.append(context)
            except Exception:
                task_contexts.append(f"{t.task} at {t.time} → (no forecast data found)")

        tasks_text = "\n".join(task_contexts)

        # AI prompt
        prompt = f"""
You are an AI that gives short, practical advice about each task 
based on the current weather conditions. You must only reply to 
the provided tasks — do not invent new ones.

Weather in {weather['barangay']}, {weather['province']}: 
{weather['temperature']}°C, humidity {weather['humidity']}%, 
UV index {weather['uv_index']}, heat index {weather['heat_index']}°C ({weather['risk_level']}).

Tasks to evaluate:
{tasks_text}

Respond ONLY with suggestions for these exact tasks.
For each, follow this format exactly:
- [Task name] at [time] -> [one-sentence suggestion]
"""

        response = co.chat(
            model="command-r-plus-08-2024",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=300
        )

        ai_output = response.message.content[0].text.strip()
        print("AI OUTPUT:", ai_output)

        suggestions = []
        for line in ai_output.splitlines():
            if "->" in line:
                task, suggestion = line.split("->", 1)
                suggestions.append(TaskSuggestion(
                    task=task.strip("- ").strip(),
                    suggestion=suggestion.strip()
                ))

        return suggestions

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
