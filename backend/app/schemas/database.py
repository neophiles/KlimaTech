from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HeatLogCreate(BaseModel):
    barangay_id: int
    temperature_c: float
    humidity: float
    heat_index_c: float
    risk_level: str

class HeatLogRead(BaseModel):
    id: int
    barangay_id: int
    temperature_c: float
    humidity: float
    heat_index_c: float
    risk_level: str
    recorded_at: datetime