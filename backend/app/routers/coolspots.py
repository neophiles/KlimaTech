from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db import get_session
from app.models import CoolSpot, Report

router = APIRouter(prefix="/coolspots", tags=["CoolSpots"])

@router.get("/{coolspot_id}")
async def get_coolspot(coolspot_id: int, session: Session = Depends(get_session)):
    coolspot = session.get(CoolSpot, coolspot_id)
    if not coolspot:
        return {"error": "Cool spot not found"}
    reports = session.exec(select(Report).where(Report.coolspot_id == coolspot_id)).all()
    return {
        "id": coolspot.id,
        "barangay_id": coolspot.barangay_id,
        "name": coolspot.name,
        "type": coolspot.type,
        "lat": coolspot.lat,
        "lon": coolspot.lon,
        "reports": reports
    }