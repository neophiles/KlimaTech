import httpx
from datetime import datetime, timedelta, timezone
from app.utils.heat_index import calculate_heat_index

PH_TZ = timezone(timedelta(hours=8))
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


async def fetch_hourly_data(lat: float, lon: float, timeout: int = 10) -> dict:
    """Fetch raw hourly forecast JSON from Open-Meteo."""
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "uv_index"],
            "timezone": "Asia/Manila",
        }
        r = await client.get(OPEN_METEO_URL, params=params, timeout=timeout)
        r.raise_for_status()
        return r.json()


async def get_today_hourly_forecast(lat: float, lon: float) -> list[dict]:
    """Return today's hourly forecast list with heat index + risk calculated."""
    data = await fetch_hourly_data(lat, lon)
    hourly = data.get("hourly")
    if not hourly:
        raise ValueError("Forecast API returned no hourly data")

    times = hourly.get("time", [])
    temps = hourly.get("temperature_2m", [])
    hums = hourly.get("relative_humidity_2m", [])
    winds = hourly.get("wind_speed_10m", [])
    uvs = hourly.get("uv_index", [])

    today = datetime.now(PH_TZ).date()
    forecast = []
    for i, t in enumerate(times):
        dt = datetime.fromisoformat(t)
        if dt.date() == today:
            hi, risk = calculate_heat_index(temps[i], hums[i])
            forecast.append({
                "time": t,
                "temperature": temps[i],
                "humidity": hums[i],
                "wind_speed": winds[i],
                "uv_index": uvs[i],
                "heat_index": hi,
                "risk_level": risk
            })

    return forecast