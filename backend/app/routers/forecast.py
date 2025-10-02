import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime, timedelta, timezone
from app.models import Barangay
from app.db import get_session
from app.utils.heat_index import calculate_heat_index
from fastapi import status

router = APIRouter(prefix="/barangays", tags=["Barangays"])

PH_TZ = timezone(timedelta(hours=8))
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

@router.get("/{barangay_id}/forecast")
async def get_barangay_forecast(barangay_id: int, session: Session = Depends(get_session)):
    barangay = session.get(Barangay, barangay_id)
    if not barangay:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barangay not found")

    async with httpx.AsyncClient() as client:
        params = {
            "latitude": barangay.lat,
            "longitude": barangay.lon,
            "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "uv_index"],
            "timezone": "Asia/Manila"
        }
        r = await client.get(OPEN_METEO_URL, params=params)
        data = r.json()

    # Extract hourly data
    times = data["hourly"]["time"]
    temps = data["hourly"]["temperature_2m"]
    hums = data["hourly"]["relative_humidity_2m"]
    winds = data["hourly"]["wind_speed_10m"]
    uvs = data["hourly"]["uv_index"]

    # Get today's date in Asia/Manila timezone
    now = datetime.now(PH_TZ)
    today = now.date()

    # Compute heat index for each hour, but only for today
    forecast = []
    for i in range(len(times)):
        dt = datetime.fromisoformat(times[i])
        if dt.date() == today:
            hi, risk = calculate_heat_index(temps[i], hums[i])
            forecast.append({
                "time": times[i],
                "temperature": temps[i],
                "humidity": hums[i],
                "wind_speed": winds[i],
                "uv_index": uvs[i],
                "heat_index": hi,
                "risk_level": risk
            })

    return {
        "barangay_id": barangay.id,
        "barangay": barangay.barangay,
        "locality": barangay.locality,
        "province": barangay.province,
        "lat": barangay.lat,
        "lon": barangay.lon,
        "forecast": forecast
    }