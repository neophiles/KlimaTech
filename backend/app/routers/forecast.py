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
    
    if not barangay.lat or not barangay.lon:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Barangay coordinates missing")
    
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": barangay.lat,
            "longitude": barangay.lon,
            "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "uv_index"],
            "timezone": "Asia/Manila"
        }
        try:
            r = await client.get(OPEN_METEO_URL, params=params, timeout=10)
            r.raise_for_status()
            data = r.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Failed to fetch forecast: {e}")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"Forecast API error: {e}")

    hourly = data.get("hourly")
    if not hourly:
        raise HTTPException(status_code=502, detail="Forecast API returned no hourly data")

    times = hourly.get("time", [])
    temps = hourly.get("temperature_2m", [])
    hums = hourly.get("relative_humidity_2m", [])
    winds = hourly.get("wind_speed_10m", [])
    uvs = hourly.get("uv_index", [])

    now = datetime.now(PH_TZ).date()
    forecast = []
    for i in range(len(times)):
        dt = datetime.fromisoformat(times[i])
        if dt.date() == now:
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
