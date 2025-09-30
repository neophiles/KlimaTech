from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db import get_session
from app.models import CoolSpot, Report
from app.schemas.coolspots import ReportRead, CoolSpotRead, CoolSpotCreate

router = APIRouter(prefix="/coolspots", tags=["CoolSpots"])

@router.post("/add", response_model=CoolSpotRead)
async def create_coolspot(coolspot: CoolSpotCreate, session: Session = Depends(get_session)):
    new_spot = CoolSpot(**coolspot.model_dump())
    session.add(new_spot)
    session.commit()
    session.refresh(new_spot)
    return new_spot


@router.post("/{coolspot_id}/report")
async def add_report(coolspot_id: int, report: ReportRead, session: Session = Depends(get_session)):
    new_report = Report(coolspot_id=coolspot_id, **report.model_dump())
    session.add(new_report)
    session.commit()
    session.refresh(new_report)


@router.get("/{coolspot_id}", response_model=CoolSpotRead)
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
