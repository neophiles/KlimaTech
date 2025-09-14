from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from .heat_log import HeatLog


class Barangay(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    lat: float
    lon: float

    heat_logs: List["HeatLog"] = Relationship(back_populates="barangay")
