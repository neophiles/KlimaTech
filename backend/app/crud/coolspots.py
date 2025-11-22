from sqlmodel import Session, select
from fastapi import UploadFile, HTTPException
import os
from math import radians, sin, cos, sqrt, atan2
from typing import Optional
from app.models import CoolSpot, Report, Vote, UserProfile

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)
    a = sin(d_lat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

async def save_upload_file(file: UploadFile) -> str:
    os.makedirs("static/uploads", exist_ok=True)
    content = await file.read()
    file_location = f"static/uploads/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(content)
    return f"/static/uploads/{file.filename}"

def get_all_coolspots(session: Session) -> list[CoolSpot]:
    return session.exec(select(CoolSpot)).all()

def get_coolspot_with_reports(session: Session, spot_id: int) -> dict:
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

def create_coolspot(
    session: Session,
    barangay_id: int,
    name: str,
    description: str,
    type: str,
    lat: float,
    lon: float,
    address: Optional[str] = None,
    photo_url: Optional[str] = None
) -> CoolSpot:
    new_coolspot = CoolSpot(
        barangay_id=barangay_id,
        name=name,
        address=address,
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

def add_report(
    session: Session,
    spot_id: int,
    user_id: int,
    note: str,
    photo_url: Optional[str] = None
) -> Report:
    spot = session.get(CoolSpot, spot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Cool spot not found")

    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

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

def vote_spot(coolspot_id: int, user_id: int, vote_type: str, session: Session) -> dict:
    if vote_type not in ("like", "dislike"):
        raise HTTPException(status_code=400, detail="Invalid vote type")

    spot = session.get(CoolSpot, coolspot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Spot not found")

    spot.likes = spot.likes or 0
    spot.dislikes = spot.dislikes or 0

    vote = session.exec(
        select(Vote).where(Vote.user_id == user_id, Vote.coolspot_id == coolspot_id)
    ).first()

    if vote:
        if vote.vote_type == vote_type:
            session.delete(vote)
            if vote_type == "like":
                spot.likes = max(0, spot.likes - 1)
            else:
                spot.dislikes = max(0, spot.dislikes - 1)
        else:
            if vote_type == "like":
                spot.likes += 1
                spot.dislikes = max(0, spot.dislikes - 1)
            else:
                spot.dislikes += 1
                spot.likes = max(0, spot.likes - 1)
            vote.vote_type = vote_type
    else:
        new_vote = Vote(user_id=user_id, coolspot_id=coolspot_id, vote_type=vote_type)
        session.add(new_vote)
        if vote_type == "like":
            spot.likes += 1
        else:
            spot.dislikes += 1

    session.add(spot)
    session.commit()
    session.refresh(spot)

    current_vote = session.exec(
        select(Vote).where(Vote.user_id == user_id, Vote.coolspot_id == coolspot_id)
    ).first()
    user_vote = current_vote.vote_type if current_vote else None

    return {"likes": spot.likes, "dislikes": spot.dislikes, "user_vote": user_vote}

def get_votes_for_spot(session: Session, coolspot_id: int, user_id: int) -> dict:
    spot = session.get(CoolSpot, coolspot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Spot not found")

    likes = spot.likes or 0
    dislikes = spot.dislikes or 0

    vote = session.exec(
        select(Vote).where(Vote.coolspot_id == coolspot_id, Vote.user_id == user_id)
    ).first()

    return {
        "likes": likes,
        "dislikes": dislikes,
        "user_vote": vote.vote_type if vote else None
    }

def get_sorted_preskospots(session: Session, lat: float, lon: float) -> list[dict]:
    spots = session.exec(select(CoolSpot)).all()
    if not spots:
        return []

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
    return spots_with_distance