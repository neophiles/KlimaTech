from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session
from datetime import datetime, timedelta
from app.schemas.barangay import (
    BarangaySummary,
    BarangayDetail
)
from app.db import get_session
from app.crud.barangays import (
    fetch_and_save_heatlog,
    get_latest_heatlog,
    get_all_barangays,
    get_barangay_by_id,
    find_nearest_barangay,
    fetch_user_location_weather,
    PH_TZ
)

router = APIRouter(prefix="/barangays", tags=["Barangays"])


@router.get("/all", response_model=list[BarangaySummary])
async def get_barangays(
    session: Session = Depends(get_session),
    lat: float | None = Query(None, description="User's current latitude"),
    lon: float | None = Query(None, description="User's current longitude")
):
    barangays_data = get_all_barangays(session)
    results = []
    now = datetime.now(PH_TZ).replace(tzinfo=None)

    for b in barangays_data:
        latest_log = get_latest_heatlog(b.id, session)

        if latest_log and (now - latest_log.recorded_at) < timedelta(hours=1):
            log = latest_log
        else:
            log = await fetch_and_save_heatlog(b, session)

        results.append({
            "id": b.id,
            "barangay": b.barangay,
            "locality": b.locality,
            "province": b.province,
            "lat": b.lat,
            "lon": b.lon,
            "heat_index": log.heat_index_c,
            "risk_level": log.risk_level,
            "updated_at": log.recorded_at
        })

    if lat is not None and lon is not None:
        weather = await fetch_user_location_weather(lat, lon)
        results.append({
            "id": 0,
            "barangay": "Your Location",
            "locality": "User Provided",
            "province": "-",
            "lat": lat,
            "lon": lon,
            "heat_index": weather["heat_index"],
            "risk_level": weather["risk_level"],
            "updated_at": datetime.now(PH_TZ).replace(tzinfo=None)
        })

    return results


@router.get("/nearest")
async def get_nearest_barangay(
    lat: float = Query(..., description="User's current latitude"),
    lon: float = Query(..., description="User's current longitude"),
    session: Session = Depends(get_session)
):
    barangays = get_all_barangays(session)
    if not barangays:
        raise HTTPException(status_code=404, detail="No barangays found")

    nearest = find_nearest_barangay(lat, lon, barangays)
    latest_log = get_latest_heatlog(nearest.id, session)

    current_data = None
    if latest_log:
        current_data = {
            "temperature": latest_log.temperature_c,
            "humidity": latest_log.humidity,
            "wind_speed": latest_log.wind_speed,
            "uv_index": latest_log.uv_index,
            "heat_index": latest_log.heat_index_c,
            "risk_level": latest_log.risk_level,
            "updated_at": latest_log.recorded_at,
        }

    return {
        "id": nearest.id,
        "barangay": nearest.barangay,
        "locality": nearest.locality,
        "province": nearest.province,
        "lat": nearest.lat,
        "lon": nearest.lon,
        "current": current_data,
        "daily_briefing": {
            "safe_hours": "Before 10AM, After 4PM",
            "avoid_hours": "11AM–3PM",
            "advice": "Hydrate frequently and avoid prolonged outdoor work."
        },
    }


@router.get("/{barangay_id}", response_model=BarangayDetail)
async def get_barangay(barangay_id: int, session: Session = Depends(get_session)):
    barangay_data = get_barangay_by_id(barangay_id, session)
    if not barangay_data:
        raise HTTPException(status_code=404, detail="Barangay not found")

    latest_log = get_latest_heatlog(barangay_id, session)
    now = datetime.now(PH_TZ).replace(tzinfo=None)

    if latest_log and (now - latest_log.recorded_at) < timedelta(hours=1):
        log = latest_log
    else:
        log = await fetch_and_save_heatlog(barangay_data, session)

    return {
        "id": barangay_data.id,
        "barangay": barangay_data.barangay,
        "locality": barangay_data.locality,
        "province": barangay_data.province,
        "lat": barangay_data.lat,
        "lon": barangay_data.lon,
        "current": {
            "temperature": log.temperature_c,
            "humidity": log.humidity,
            "wind_speed": log.wind_speed,
            "uv_index": log.uv_index,
            "heat_index": log.heat_index_c,
            "risk_level": log.risk_level,
            "updated_at": log.recorded_at
        },
        "daily_briefing": {
            "safe_hours": "Before 10AM, After 4PM",
            "avoid_hours": "11AM–3PM",
            "advice": "Hydrate frequently and avoid prolonged outdoor work."
        },
        "forecast": []
    }