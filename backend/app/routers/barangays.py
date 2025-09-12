from fastapi import APIRouter
from datetime import datetime
from app.schemas.barangay import (
    BarangayBase,
    BarangaySummary,
    BarangayDetail
)

import httpx
from app.utils.heat_index import calculate_heat_index
from datetime import datetime


router = APIRouter(prefix="/barangays", tags=["Barangays"])

# Hardcode 2 barangays (later move to DB)
barangays_data = [
    {"id": 1, "name": "Barangay Dalahican, Lucena", "lat": 13.9317, "lon": 121.6233},
    {"id": 2, "name": "Barangay Ibabang Dupay, Lucena", "lat": 13.9405, "lon": 121.6170},
]


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


@router.get("/barangays", response_model=list[BarangaySummary])
async def get_barangays():
    results = []

    async with httpx.AsyncClient() as client:
        for b in barangays_data:
            # Fetch current weather data
            params = {
                "latitude": b["lat"],
                "longitude": b["lon"],
                "current": ["temperature_2m", "relative_humidity_2m"]
            }
            r = await client.get(OPEN_METEO_URL, params=params)
            data = r.json()

            temp_c = data["current"]["temperature_2m"]
            humidity = data["current"]["relative_humidity_2m"]

            # Calculate heat index and risk level
            hi, risk = calculate_heat_index(temp_c, humidity)

            results.append({
                "id": b["id"],
                "name": b["name"],
                "lat": b["lat"],
                "lon": b["lon"],
                "heat_index": hi,
                "risk_level": risk,
                "updated_at": datetime.utcnow()
            })

    return results



@router.get("/{barangay_id}", response_model=BarangayDetail)
def get_barangay(barangay_id: int):
    # mock detail response
    barangay = next((b for b in barangays_data if b["id"] == barangay_id), None)
    if not barangay:
        return {"error": "Barangay not found"}
    
    return {
        "id": barangay["id"],
        "name": barangay["name"],
        "lat": barangay["lat"],
        "lon": barangay["lon"],
        "current": {
            "temperature": 34.5,
            "humidity": 72,
            "heat_index": barangay["heat_index"],
            "risk_level": barangay["risk_level"],
            "updated_at": barangay["updated_at"]
        },
        "daily_briefing": {
            "safe_hours": "Before 10AM, After 4PM",
            "avoid_hours": "11AM–3PM",
            "advice": "Hydrate frequently and avoid prolonged outdoor work."
        },
        "forecast": [
            {"time": "2025-08-29T08:00:00Z", "heat_index": 34.5, "risk_level": "Caution"},
            {"time": "2025-08-29T11:00:00Z", "heat_index": 41.3, "risk_level": "Danger"},
            {"time": "2025-08-29T14:00:00Z", "heat_index": 43.0, "risk_level": "Danger"}
        ]
    }