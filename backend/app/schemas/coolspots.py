from pydantic import BaseModel
from typing import List, Optional

class ReportRead(BaseModel):
    user_id: Optional[int]
    note: str
    date: Optional[str] = None
    time: Optional[str] = None
    photo_url: Optional[str] = None 


class ReportOut(BaseModel):
    id: int
    user_id: int
    username: Optional[str] = None
    note: str
    photo_url: Optional[str] = None
    date: str
    time: str

class CoolSpotRead(BaseModel):
    id: int
    barangay_id: int
    name: str
    description: str
    type: str
    lat: float
    lon: float
    photo_url: Optional[str] = None
    reports: List[ReportRead]


class CoolSpotCreate(BaseModel):
    barangay_id: int
    name: str
    type: str
    lat: float
    lon: float


class CoolSpotOut(BaseModel):
    id: int
    barangay_id: int
    name: str
    description: str
    type: str
    lat: float
    lon: float
    photo_url: Optional[str] = None
    reports: List[ReportOut] = []