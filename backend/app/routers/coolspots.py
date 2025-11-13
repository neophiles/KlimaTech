from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from app.db import get_session
from app.schemas.coolspots import CoolSpotRead
from fastapi import Query
from app.schemas.coolspots import CoolSpotOut, ReportOut
from sqlmodel import Session

from app.crud.coolspots import (
    save_upload_file,
    vote_spot,
    get_all_coolspots,
    get_coolspot_with_reports,
    create_coolspot,
    add_report,
    get_votes_for_spot,
    get_sorted_preskospots,
)

router = APIRouter(prefix="/coolspots", tags=["CoolSpots"])


@router.get("/all", response_model=list[CoolSpotRead])
async def get_all_coolspots_route(session: Session = Depends(get_session)):
    return get_all_coolspots(session)

@router.post("/{spot_id}/report", response_model=ReportOut)
async def add_report_route(
    spot_id: int,
    user_id: int = Form(...),
    note: str = Form(...),
    file: UploadFile = File(None),
    session: Session = Depends(get_session),
):
    photo_url = None
    if file:
        photo_url = await save_upload_file(file)

    report = add_report(session, spot_id, user_id, note, photo_url)
    return report

@router.post("/add", response_model=CoolSpotRead)
async def create_coolspot_route(
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
        photo_url = await save_upload_file(file)

    new_coolspot = create_coolspot(
        session,
        barangay_id=barangay_id,
        name=name,
        description=description,
        type=type,
        lat=lat,
        lon=lon,
        photo_url=photo_url
    )
    return new_coolspot

@router.get("/{spot_id}", response_model=CoolSpotOut)
def get_coolspot_route(spot_id: int, session: Session = Depends(get_session)):
    return get_coolspot_with_reports(session, spot_id)

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
def get_votes_route(
    coolspot_id: int,
    session: Session = Depends(get_session),
    user_id: int = Query(..., description="Current user ID")
):
    return get_votes_for_spot(session, coolspot_id, user_id)

@router.get("/preskospots/nearest")
def get_sorted_preskospots_route(
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude"),
    session: Session = Depends(get_session)
):
    spots_with_distance = get_sorted_preskospots(session, lat, lon)
    if not spots_with_distance:
        raise HTTPException(status_code=404, detail="No CoolSpots found")
    return {"spots": spots_with_distance}
