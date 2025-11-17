import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.models import Barangay
from app.db import get_session
from fastapi import status

from app.crud.forecast import get_today_hourly_forecast

router = APIRouter(prefix="/barangays", tags=["Barangays"])

@router.get("/{barangay_id}/forecast")
async def get_barangay_forecast(barangay_id: int, session: Session = Depends(get_session)):
    barangay = session.get(Barangay, barangay_id)
    if not barangay:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barangay not found")
    
    if not barangay.lat or not barangay.lon:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Barangay coordinates missing")
    
    try:
        forecast = await get_today_hourly_forecast(barangay.lat, barangay.lon)
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch forecast: {e}")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Forecast API error: {e}")
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception:
        raise HTTPException(status_code=502, detail="Unexpected error fetching forecast")

    return {
        "barangay_id": barangay.id,
        "barangay": barangay.barangay,
        "locality": barangay.locality,
        "province": barangay.province,
        "lat": barangay.lat,
        "lon": barangay.lon,
        "forecast": forecast
    }
