from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime, timezone, timedelta
from datetime import datetime

PH_TZ = timezone(timedelta(hours=8))

class Barangay(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    barangay: str
    locality: str
    province: str
    lat: float
    lon: float
    heat_logs: List["HeatLog"] = Relationship(back_populates="barangay")


class HeatLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    barangay_id: int = Field(foreign_key="barangay.id")
    temperature_c: float
    humidity: float
    wind_speed: float
    uv_index: Optional[float] = None
    heat_index_c: float
    risk_level: str
    recorded_at: datetime = Field(default_factory=lambda: datetime.now(PH_TZ).replace(tzinfo=None))
    barangay: Optional["Barangay"] = Relationship(back_populates="heat_logs")


class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    coolspot_id: int = Field(foreign_key="coolspot.id")
    user_id: int
    note: str
    date: str = Field(default_factory=lambda: datetime.now().date().isoformat())
    time: str = Field(default_factory=lambda: datetime.now().time().isoformat(timespec="seconds"))
    photo_url: Optional[str] = None 
    coolspot: Optional["CoolSpot"] = Relationship(back_populates="reports")


class CoolSpot(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    barangay_id: int
    name: str
    description: str
    type: str
    lat: float
    lon: float
    likes: int = Field(default=0)
    dislikes: int = Field(default=0)
    photo_url: Optional[str] = None
    reports: List[Report] = Relationship(back_populates="coolspot")


class UserProfile(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(default=None, index=True, unique=True)
    phone_number: Optional[str] = Field(default=None, index=True, unique=True)
    lat: Optional[float] = Field(default=None)
    lon: Optional[float] = Field(default=None)