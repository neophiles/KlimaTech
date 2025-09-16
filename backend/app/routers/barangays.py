from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime
from app.schemas.barangay import (
    BarangayBase,
    BarangaySummary,
    BarangayDetail
)
from app.schemas.database import HeatLogRead, HeatLogCreate

import httpx
from app.utils.heat_index import calculate_heat_index
from datetime import datetime
from app.models import Barangay, HeatLog
from app.db import get_session
from fastapi import HTTPException
from fastapi import status
from datetime import datetime, timedelta


router = APIRouter(prefix="/barangays", tags=["Barangays"])


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

async def fetch_and_save_heatlog(barangay: Barangay, session: Session) -> HeatLog:
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": barangay.lat,
            "longitude": barangay.lon,
            "current": ["temperature_2m", "relative_humidity_2m"]
        }
        r = await client.get(OPEN_METEO_URL, params=params)
        data = r.json()
        temp_c = data["current"]["temperature_2m"]
        humidity = data["current"]["relative_humidity_2m"]
        hi, risk = calculate_heat_index(temp_c, humidity)

    heatlog = HeatLog(
        barangay_id=barangay.id,
        temperature_c=temp_c,
        humidity=humidity,
        heat_index_c=hi,
        risk_level=risk,
        recorded_at=datetime.utcnow()
    )
    session.add(heatlog)
    session.commit()
    session.refresh(heatlog)
    return heatlog


@router.post("/{barangay_id}/heatlog", response_model=HeatLogRead)
async def save_heatlog_endpoint(barangay_id: int, session: Session = Depends(get_session)):
    barangay = session.get(Barangay, barangay_id)
    if not barangay:
        raise HTTPException(status_code=404, detail="Barangay not found")
    return await fetch_and_save_heatlog(barangay, session)


@router.get("/barangays", response_model=list[BarangaySummary])
async def get_barangays(session: Session = Depends(get_session)):
    # Fetch barangays from DB
    barangays_data = session.exec(select(Barangay)).all()
    results = []

    async with httpx.AsyncClient() as client:
        for b in barangays_data:
            # Fetch current weather data
            params = {
                "latitude": b.lat,
                "longitude": b.lon,
                "current": ["temperature_2m", "relative_humidity_2m"]
            }
            r = await client.get(OPEN_METEO_URL, params=params)
            data = r.json()

            temp_c = data["current"]["temperature_2m"]
            humidity = data["current"]["relative_humidity_2m"]

            # Calculate heat index and risk level
            hi, risk = calculate_heat_index(temp_c, humidity)

            results.append({
                "id": b.id,
                "name": b.name,
                "lat": b.lat,
                "lon": b.lon,
                "heat_index": hi,
                "risk_level": risk,
                "updated_at": datetime.utcnow()
            })

    return results



@router.get("/{barangay_id}", response_model=BarangayDetail)
async def get_barangay(barangay_id: int, session: Session = Depends(get_session)):
    barangay_data = session.get(Barangay, barangay_id)
    if not barangay_data:
        return {"error": "Barangay not found"}

    # Get latest HeatLog for this barangay
    latest_log = session.exec(
        select(HeatLog)
        .where(HeatLog.barangay_id == barangay_id)
        .order_by(HeatLog.recorded_at.desc())
    ).first()

    now = datetime.utcnow()
    if latest_log and (now - latest_log.recorded_at) < timedelta(hours=1):
        # Use cached data if less than 1 hour old
        log = latest_log
    else:
        # Generate new HeatLog and save to DB
        log = await fetch_and_save_heatlog(barangay_data, session)

    return {
        "id": barangay_data.id,
        "name": barangay_data.name,
        "lat": barangay_data.lat,
        "lon": barangay_data.lon,
        "current": {
            "temperature": log.temperature_c,
            "humidity": log.humidity,
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
