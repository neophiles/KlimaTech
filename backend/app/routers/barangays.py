from fastapi import APIRouter
from datetime import datetime


router = APIRouter(prefix="/barangays", tags=["Barangays"])

# Mock data
barangays_data = [
    {
        "id": 1,
        "name": "Gulang-Gulang",
        "lat": 13.9432,
        "lon": 121.6224,
        "heat_index": 41.3,
        "risk_level": "Danger",
        "updated_at": datetime.utcnow()
    },
    {
        "id": 2,
        "name": "Ibabang Dupay",
        "lat": 13.9368,
        "lon": 121.6179,
        "heat_index": 36.7,
        "risk_level": "Extreme Caution",
        "updated_at": datetime.utcnow()
    }
]

@router.get("/")
def get_barangays():
    return barangays_data



@router.get("/{barangay_id}")
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