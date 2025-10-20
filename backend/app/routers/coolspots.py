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

router = APIRouter(prefix="/coolspots", tags=["CoolSpots"])



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
def get_nearest_preskospot(
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude"),
    session: Session = Depends(get_session)
):
    spots = session.exec(select(CoolSpot)).all()

    if not spots:
        raise HTTPException(status_code=404, detail="No CoolSpots found")

    nearest_spot = min(
        spots,
        key=lambda s: haversine(lat, lon, s.lat, s.lon)
    )

    distance = haversine(lat, lon, nearest_spot.lat, nearest_spot.lon)

    return {
        "id": nearest_spot.id,
        "name": nearest_spot.name,
        "lat": nearest_spot.lat,
        "lon": nearest_spot.lon,
        "distance": round(distance, 2),
        "barangay_id": nearest_spot.barangay_id,
    }
