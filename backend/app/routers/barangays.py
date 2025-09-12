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