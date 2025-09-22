from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime, timezone, timedelta

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
    heat_index_c: float
    risk_level: str
    recorded_at: datetime = Field(default_factory=lambda: datetime.now(PH_TZ).replace(tzinfo=None))
    barangay: Optional["Barangay"] = Relationship(back_populates="heat_logs")