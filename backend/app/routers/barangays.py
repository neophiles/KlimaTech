from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime
from app.schemas.barangay import (
    BarangayBase,
    BarangaySummary,
    BarangayDetail
)

import httpx
from app.utils.heat_index import calculate_heat_index
from datetime import datetime
from app.models import Barangay
from app.models import HeatLog
from app.db import get_session


router = APIRouter(prefix="/barangays", tags=["Barangays"])


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


@router.get("/barangays", response_model=list[BarangaySummary])
async def get_barangays(session: Session = Depends(get_session)):
    # Fetch barangays from DB
    barangays_data = session.exec(select(Barangay)).all()
    results = []

    async with httpx.AsyncClient() as client:
        for b in barangays_data:
            # Fetch current weather data
            params = {
                "latitude": b.lat,
                "longitude": b.lon,
                "current": ["temperature_2m", "relative_humidity_2m"]
            }
            r = await client.get(OPEN_METEO_URL, params=params)
            data = r.json()

            temp_c = data["current"]["temperature_2m"]
            humidity = data["current"]["relative_humidity_2m"]

            # Calculate heat index and risk level
            hi, risk = calculate_heat_index(temp_c, humidity)

            results.append({
                "id": b.id,
                "name": b.name,
                "lat": b.lat,
                "lon": b.lon,
                "heat_index": hi,
                "risk_level": risk,
                "updated_at": datetime.utcnow()
            })

    return results



@router.get("/{barangay_id}", response_model=BarangayDetail)
async def get_barangay(barangay_id: int, session: Session = Depends(get_session)):
    barangay_data = session.get(Barangay, barangay_id)
    if not barangay_data:
        return {"error": "Barangay not found"}

    # Fetch current weather data
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": barangay_data.lat,
            "longitude": barangay_data.lon,
            "current": ["temperature_2m", "relative_humidity_2m"]
        }
        r = await client.get(OPEN_METEO_URL, params=params)
        data = r.json()
        temp_c = data["current"]["temperature_2m"]
        humidity = data["current"]["relative_humidity_2m"]
        hi, risk = calculate_heat_index(temp_c, humidity)

    return {
        "id": barangay_data.id,
        "name": barangay_data.name,
        "lat": barangay_data.lat,
        "lon": barangay_data.lon,
        "current": {
            "temperature": temp_c,
            "humidity": humidity,
            "heat_index": hi,
            "risk_level": risk,
            "updated_at": datetime.utcnow()
        },
        "daily_briefing": {
            # Example briefing data
            # TODO: Generate based on actual data
            "safe_hours": "Before 10AM, After 4PM",
            "avoid_hours": "11AM–3PM",
            "advice": "Hydrate frequently and avoid prolonged outdoor work."
        },
        "forecast": [
            # Future implementation: Add forecast data here
            # For now, return empty list
        ]
    }