from sqlmodel import Session, select
from datetime import datetime, timedelta, timezone
from math import radians, sin, cos, sqrt, atan2
import httpx

from app.models import Barangay, HeatLog
from app.utils.heat_index import calculate_heat_index

PH_TZ = timezone(timedelta(hours=8))
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


async def fetch_and_save_heatlog(barangay: Barangay, session: Session) -> HeatLog:
    """Fetch weather data from Open Meteo API and save HeatLog"""
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": barangay.lat,
            "longitude": barangay.lon,
            "current": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "uv_index"],
            "timezone": "Asia/Manila"
        }
        r = await client.get(OPEN_METEO_URL, params=params)
        data = r.json()
        temp_c = data["current"]["temperature_2m"]
        humidity = data["current"]["relative_humidity_2m"]
        wind_speed = data["current"]["wind_speed_10m"]
        uv_index = data["current"]["uv_index"]
        hi, risk = calculate_heat_index(temp_c, humidity)

    heatlog = HeatLog(
        barangay_id=barangay.id,
        temperature_c=temp_c,
        humidity=humidity,
        wind_speed=wind_speed,
        uv_index=uv_index,
        heat_index_c=hi,
        risk_level=risk,
        recorded_at=datetime.now(PH_TZ).replace(tzinfo=None)
    )
    session.add(heatlog)
    session.commit()
    session.refresh(heatlog)
    return heatlog


def get_latest_heatlog(barangay_id: int, session: Session) -> HeatLog:
    """Get the latest HeatLog for a barangay"""
    return session.exec(
        select(HeatLog)
        .where(HeatLog.barangay_id == barangay_id)
        .order_by(HeatLog.recorded_at.desc())
    ).first()


def get_all_barangays(session: Session) -> list[Barangay]:
    """Get all barangays from database"""
    return session.exec(select(Barangay)).all()


def get_barangay_by_id(barangay_id: int, session: Session) -> Barangay:
    """Get a single barangay by ID"""
    return session.get(Barangay, barangay_id)


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in km using Haversine formula"""
    R = 6371  # Earth radius in km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c


def find_nearest_barangay(lat: float, lon: float, barangays: list[Barangay]) -> Barangay:
    """Find the nearest barangay to given coordinates"""
    return min(barangays, key=lambda b: haversine_distance(lat, lon, b.lat, b.lon))


async def fetch_user_location_weather(lat: float, lon: float) -> dict:
    """Fetch weather data for user's current location"""
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "uv_index"],
            "timezone": "Asia/Manila"
        }
        r = await client.get(OPEN_METEO_URL, params=params)
        data = r.json()
        temp_c = data["current"]["temperature_2m"]
        humidity = data["current"]["relative_humidity_2m"]
        wind_speed = data["current"]["wind_speed_10m"]
        uv_index = data["current"]["uv_index"]
        hi, risk = calculate_heat_index(temp_c, humidity)

    return {
        "temperature": temp_c,
        "humidity": humidity,
        "wind_speed": wind_speed,
        "uv_index": uv_index,
        "heat_index": hi,
        "risk_level": risk
    }