from fastapi import APIRouter, Query
from app.ml.model import predict_hourly_heat_index

router = APIRouter(prefix="/ml", tags=["ML"])

@router.get("/predict-hourly")
def get_hourly_heat_index(
    start_hour: int = Query(8, ge=0, le=23),
    end_hour: int = Query(19, ge=0, le=23),
    temperature: float = Query(...),  
    humidity: float = Query(..., ge=0, le=100),
    wind: float = Query(..., ge=0),
    uv_index: float = Query(..., ge=0)
):
    hours = list(range(start_hour, end_hour + 1))
    heat_indices = predict_hourly_heat_index(hours, temperature, humidity, wind, uv_index)
    return {"hours": hours, "heat_indices": heat_indices}