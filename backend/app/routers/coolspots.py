from fastapi import APIRouter, Depends, File, UploadFile, Form
import os
from sqlmodel import Session, select
from app.db import get_session
from app.models import CoolSpot, Report
from app.schemas.coolspots import ReportRead, CoolSpotRead, CoolSpotCreate

router = APIRouter(prefix="/coolspots", tags=["CoolSpots"])


@router.get("/all", response_model=list[CoolSpotRead])
async def get_all_coolspots(session: Session = Depends(get_session)):
    coolspots = session.exec(select(CoolSpot)).all()
    return coolspots


@router.post("/{coolspot_id}/report")
async def add_report(
    coolspot_id: int,
    user_id: int = Form(...),
    note: str = Form(...),
    file: UploadFile = File(None),
    session: Session = Depends(get_session)
):
    # Handle file upload if provided
    photo_url = None
    if file:
        os.makedirs("static/uploads", exist_ok=True) 
        file_location = f"static/uploads/{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())
        photo_url = f"/static/uploads/{file.filename}"


    new_report = Report(
        coolspot_id=coolspot_id,
        user_id=user_id,
        note=note,
        photo_url=photo_url
    )
    session.add(new_report)
    session.commit()
    session.refresh(new_report)
    return {"message": "Report added successfully", "report_id": new_report.id}


@router.post("/{coolspot_id}/report")
async def add_report(coolspot_id: int, report: ReportRead, session: Session = Depends(get_session)):
    new_report = Report(coolspot_id=coolspot_id, **report.model_dump())
    session.add(new_report)
    session.commit()
    session.refresh(new_report)
    return {"message": "Report added successfully", "report_id": new_report.id}


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


