from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime, timezone, timedelta
from datetime import datetime
from enum import Enum

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
    user_id: int = Field(foreign_key="userprofile.id")  
    note: str
    date: str = Field(default_factory=lambda: datetime.now().date().isoformat())
    time: str = Field(default_factory=lambda: datetime.now().time().isoformat(timespec="seconds"))
    photo_url: Optional[str] = None 

    coolspot: Optional["CoolSpot"] = Relationship(back_populates="reports")
    user: Optional["UserProfile"] = Relationship()  


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


# USER MODEL
class UserType(str, Enum):
    student = "student"
    outdoor_worker = "outdoor_worker"
    office_worker = "office_worker"
    home_based = "home_based"

class UserProfile(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    lat: Optional[float] = None
    lon: Optional[float] = None
    user_type: Optional[UserType] = Field(default=None)

    # relationships
    student_profile: Optional["StudentProfile"] = Relationship(back_populates="user")
    outdoor_profile: Optional["OutdoorWorkerProfile"] = Relationship(back_populates="user")
    office_profile: Optional["OfficeWorkerProfile"] = Relationship(back_populates="user")
    home_profile: Optional["HomeBasedProfile"] = Relationship(back_populates="user")


class StudentProfile(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")

    days_on_campus: Optional[str] = None       # e.g. "Mon,Tue,Thu"
    commute_mode: Optional[str] = None         # e.g. "Public Transport"
    class_hours: Optional[str] = None          # e.g. "8AM-5PM"
    has_outdoor_activities: Optional[bool] = None
    outdoor_hours: Optional[str] = None        # e.g. "3PM-5PM"

    user: UserProfile = Relationship(back_populates="student_profile")

class OutdoorWorkerProfile(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")

    work_type: Optional[str] = None            # e.g. "Construction"
    work_hours: Optional[str] = None           # e.g. "8AM-4PM"
    break_type: Optional[str] = None           # e.g. "Mostly outdoors"

    user: UserProfile = Relationship(back_populates="outdoor_profile")

class OfficeWorkerProfile(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")

    office_days: Optional[str] = None          # e.g. "Mon,Tue,Wed,Thu,Fri"
    work_hours: Optional[str] = None           # e.g. "9AM-6PM"
    commute_mode: Optional[str] = None
    goes_out_for_lunch: Optional[bool] = None

    user: UserProfile = Relationship(back_populates="office_profile")

class HomeBasedProfile(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")

    outdoor_activities: Optional[str] = None   # e.g. "Exercise,Errands"
    preferred_times: Optional[str] = None      # e.g. "Early Morning,Lunchtime"

    user: UserProfile = Relationship(back_populates="home_profile")


class Vote(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    coolspot_id: int = Field(foreign_key="coolspot.id")
    vote_type: str  # "like" or "dislike"

    user: Optional["UserProfile"] = Relationship()
    coolspot: Optional["CoolSpot"] = Relationship()


class Tip(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    barangay_id: int = Field(foreign_key="barangay.id")
    content: str

    barangay: Optional["Barangay"] = Relationship()

class TipLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    tip_id: int = Field(foreign_key="tip.id")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(PH_TZ).replace(tzinfo=None))

    user: Optional["UserProfile"] = Relationship()
    tip: Optional["Tip"] = Relationship()