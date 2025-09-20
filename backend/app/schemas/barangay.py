from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BarangayBase(BaseModel):
    id: int
    barangay: str
    locality: str
    province: str
    lat: float
    lon: float

class BarangaySummary(BarangayBase):
    heat_index: float
    risk_level: str
    updated_at: datetime

class BarangayDetail(BarangayBase): 
    current: dict
    daily_briefing: dict
    forecast: Optional[list] = None
