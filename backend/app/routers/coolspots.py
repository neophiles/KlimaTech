from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
import os
from sqlmodel import Session, select
from app.db import get_session
from app.models import CoolSpot, Report, Vote
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


@router.post("/add", response_model=CoolSpotRead)
async def create_coolspot(
    barangay_id: int = Form(...),
    name: str = Form(...),
    description: str = Form(...),
    type: str = Form(...),
    lat: float = Form(...),
    lon: float = Form(...),
    file: UploadFile = File(None),
    session: Session = Depends(get_session)
):
    photo_url = None
    if file:
        os.makedirs("static/uploads", exist_ok=True)
        file_location = f"static/uploads/{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())
        photo_url = f"/static/uploads/{file.filename}"

    new_coolspot = CoolSpot(
        barangay_id=barangay_id,
        name=name,
        description=description,
        type=type,
        lat=lat,
        lon=lon,
        photo_url=photo_url
    )
    session.add(new_coolspot)
    session.commit()
    session.refresh(new_coolspot)
    return new_coolspot


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
        "description": coolspot.description,
        "type": coolspot.type,
        "lat": coolspot.lat,
        "lon": coolspot.lon,
        "photo_url": coolspot.photo_url,
        "reports": reports
    }


@router.post("/{coolspot_id}/like")
def like_spot(coolspot_id: int, user_id: int, session: Session = Depends(get_session)):
    spot = session.get(CoolSpot, coolspot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Spot not found")

    # Check if user already voted
    vote = session.exec(
        select(Vote).where(Vote.user_id == user_id, Vote.coolspot_id == coolspot_id)
    ).first()

    if vote:
        if vote.vote_type == "like":
            # Toggle off like
            session.delete(vote)
            spot.likes -= 1
        else:
            # Change dislike → like
            vote.vote_type = "like"
            spot.likes += 1
            spot.dislikes -= 1
    else:
        # New like
        vote = Vote(user_id=user_id, coolspot_id=coolspot_id, vote_type="like")
        session.add(vote)
        spot.likes += 1

    session.commit()
    session.refresh(spot)
    return {"likes": spot.likes, "dislikes": spot.dislikes}


@router.post("/{coolspot_id}/dislike")
def dislike_spot(coolspot_id: int, user_id: int, session: Session = Depends(get_session)):
    spot = session.get(CoolSpot, coolspot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Spot not found")

    # Check if user already voted
    vote = session.exec(
        select(Vote).where(Vote.user_id == user_id, Vote.coolspot_id == coolspot_id)
    ).first()

    if vote:
        if vote.vote_type == "dislike":
            # Toggle off dislike
            session.delete(vote)
            spot.dislikes -= 1
        else:
            # Change like → dislike
            vote.vote_type = "dislike"
            spot.dislikes += 1
            spot.likes -= 1
    else:
        # New dislike
        vote = Vote(user_id=user_id, spot_id=coolspot_id, vote_type="dislike")
        session.add(vote)
        spot.dislikes += 1

    session.commit()
    session.refresh(spot)
    return {"likes": spot.likes, "dislikes": spot.dislikes}