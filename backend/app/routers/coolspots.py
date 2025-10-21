from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
import os
from sqlmodel import Session, select
from app.db import get_session
from app.models import CoolSpot, Report, Vote
from app.schemas.coolspots import ReportRead, CoolSpotRead, CoolSpotCreate
from fastapi import Query
from sqlmodel import select
from app.models import CoolSpot, Vote
from math import radians, sin, cos, sqrt, atan2
from typing import List, Optional
from pydantic import BaseModel
from app.models import UserProfile, Report
from app.schemas.coolspots import CoolSpotOut, ReportOut

router = APIRouter(prefix="/coolspots", tags=["CoolSpots"])


def save_upload_file(file: UploadFile) -> str:
    os.makedirs("static/uploads", exist_ok=True)
    file_location = f"static/uploads/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(file.file.read())
    return f"/static/uploads/{file.filename}"


def haversine(lat1, lon1, lat2, lon2):
    """Calculate great-circle distance between two coordinates in km."""
    R = 6371  # Earth radius in km
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)
    a = sin(d_lat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c


def vote_spot(coolspot_id: int, user_id: int, vote_type: str, session: Session):
    try:
        if vote_type not in ("like", "dislike"):
            raise HTTPException(status_code=400, detail="Invalid vote type")

        spot = session.get(CoolSpot, coolspot_id)
        if not spot:
            raise HTTPException(status_code=404, detail="Spot not found")

        # ensure numeric counts
        spot.likes = spot.likes or 0
        spot.dislikes = spot.dislikes or 0

        vote = session.exec(
            select(Vote).where(Vote.user_id == user_id, Vote.coolspot_id == coolspot_id)
        ).first()

        if vote:
            if vote.vote_type == vote_type:
                # Toggle off
                session.delete(vote)
                if vote_type == "like":
                    spot.likes = max(0, spot.likes - 1)
                else:
                    spot.dislikes = max(0, spot.dislikes - 1)
            else:
                # Switch vote type
                if vote_type == "like":
                    spot.likes += 1
                    spot.dislikes = max(0, spot.dislikes - 1)
                else:
                    spot.dislikes += 1
                    spot.likes = max(0, spot.likes - 1)
                vote.vote_type = vote_type
        else:
            # New vote
            new_vote = Vote(user_id=user_id, coolspot_id=coolspot_id, vote_type=vote_type)
            session.add(new_vote)
            if vote_type == "like":
                spot.likes += 1
            else:
                spot.dislikes += 1

        session.add(spot)
        session.commit()
        session.refresh(spot)

        # re-query user's vote after commit
        current_vote = session.exec(
            select(Vote).where(Vote.user_id == user_id, Vote.coolspot_id == coolspot_id)
        ).first()
        user_vote = current_vote.vote_type if current_vote else None

        return {"likes": spot.likes, "dislikes": spot.dislikes, "user_vote": user_vote}

    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/all", response_model=list[CoolSpotRead])
async def get_all_coolspots(session: Session = Depends(get_session)):
    coolspots = session.exec(select(CoolSpot)).all()
    return coolspots


@router.post("/{spot_id}/report", response_model=ReportOut)
async def add_report(
    spot_id: int,
    user_id: int = Form(...),
    note: str = Form(...),
    file: UploadFile = File(None),
    session: Session = Depends(get_session),
):
    spot = session.get(CoolSpot, spot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Cool spot not found")

    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    photo_url = None
    if file:
        photo_url = await save_upload_file(file)  # your existing function

    report = Report(
        coolspot_id=spot_id,
        user_id=user_id,
        note=note,
        photo_url=photo_url,
    )

    session.add(report)
    session.commit()
    session.refresh(report)

    return report



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



@router.get("/{spot_id}", response_model=CoolSpotOut)
def get_coolspot(spot_id: int, session: Session = Depends(get_session)):
    spot = session.get(CoolSpot, spot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Cool spot not found")

    reports = session.exec(
        select(Report, UserProfile.username)
        .join(UserProfile, UserProfile.id == Report.user_id)
        .where(Report.coolspot_id == spot_id)
    ).all()

    spot_data = spot.dict()
    spot_data["reports"] = [
        {
            "id": r.Report.id,
            "user_id": r.Report.user_id,
            "username": r.username,
            "note": r.Report.note,
            "date": r.Report.date,
            "time": r.Report.time,
            "photo_url": r.Report.photo_url,
        }
        for r in reports
    ]

    return spot_data



@router.post("/{coolspot_id}/like")
def like_spot(
    coolspot_id: int,
    user_id: int = Query(..., description="Current user ID"),
    session: Session = Depends(get_session),
):
    return vote_spot(coolspot_id, user_id, "like", session)


@router.post("/{coolspot_id}/dislike")
def dislike_spot(
    coolspot_id: int,
    user_id: int = Query(..., description="Current user ID"),
    session: Session = Depends(get_session),
):
    return vote_spot(coolspot_id, user_id, "dislike", session)


@router.get("/{coolspot_id}/votes")
def get_votes(
    coolspot_id: int, 
    session: Session = Depends(get_session),
    user_id: int = Query(..., description="Current user ID")
):
    spot = session.get(CoolSpot, coolspot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Spot not found")

    # Aggregate likes/dislikes
    likes = spot.likes
    dislikes = spot.dislikes

    # Find user's vote
    vote = session.exec(
        select(Vote).where(Vote.coolspot_id == coolspot_id, Vote.user_id == user_id)
    ).first()

    user_vote = vote.vote_type if vote else None  # 'like', 'dislike', or None

    return {
        "likes": likes,
        "dislikes": dislikes,
        "user_vote": vote.vote_type if vote else None
    }


@router.get("/preskospots/nearest")
def get_sorted_preskospots(
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude"),
    session: Session = Depends(get_session)
):
    spots = session.exec(select(CoolSpot)).all()

    if not spots:
        raise HTTPException(status_code=404, detail="No CoolSpots found")

    # Sort all spots by distance
    spots_with_distance = sorted(
        [
            {
                "id": s.id,
                "name": s.name,
                "lat": s.lat,
                "lon": s.lon,
                "barangay_id": s.barangay_id,
                "distance": round(haversine(lat, lon, s.lat, s.lon), 2),
            }
            for s in spots
        ],
        key=lambda x: x["distance"]
    )

    return {"spots": spots_with_distance}
