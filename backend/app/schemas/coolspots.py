from pydantic import BaseModel
from typing import List, Optional

class ReportRead(BaseModel):
    user_id: Optional[int]
    note: str
    date: str

class CoolSpotRead(BaseModel):
    id: int
    barangay_id: int
    name: str
    type: str
    lat: float
    lon: float
    reports: List[ReportRead]