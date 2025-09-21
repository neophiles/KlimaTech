import httpx
from datetime import datetime, timedelta, timezone
from sqlmodel import Session, select
from app.db import engine
from app.models import Barangay, HeatLog
from app.utils.heat_index import calculate_heat_index

PH_TZ = timezone(timedelta(hours=8))
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

def collect_heat_data():
    with Session(engine) as session:
        barangays = session.exec(select(Barangay)).all()

        for b in barangays:
            try:
                params = {
                    "latitude": b.lat,
                    "longitude": b.lon,
                    "current": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m"],
                    "hourly": ["precipitation"],
                    "timezone": "Asia/Manila"
                }
                r = httpx.get(OPEN_METEO_URL, params=params)
                data = r.json()
                temp_c = data["current"]["temperature_2m"]
                humidity = data["current"]["relative_humidity_2m"]
                wind_speed = data["current"]["wind_speed_10m"]

                precip_values = data["hourly"]["precipitation"]
                precipitation = precip_values[-1] if precip_values else 0.0

                hi, risk = calculate_heat_index(temp_c, humidity)

                heat_log = HeatLog(
                    barangay_id=b.id,
                    temperature_c=temp_c,
                    humidity=humidity,
                    wind_speed=wind_speed,
                    precipitation=precipitation,
                    heat_index_c=hi,
                    risk_level=risk,
                    recorded_at=datetime.now(PH_TZ).replace(tzinfo=None)
                )
                session.add(heat_log)
                session.commit()
                print(f"[{datetime.now(PH_TZ).replace(tzinfo=None)}] Saved heat log for {b.barangay}")

            except Exception as e:
                print(f"Error fetching data for {getattr(b, 'barangay', getattr(b, 'name', b.id))}: {e}")
