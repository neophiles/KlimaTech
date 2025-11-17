from typing import Optional, List
from pydantic import BaseModel

class TimeRange(BaseModel):
    start: str
    end: str


class OfficeWorkerProfileIn(BaseModel):
    selectedDays: Optional[List[str]] = None
    workHours: Optional[dict] = None    # { "start": "09:00", "end": "18:00" }
    commuteType: Optional[str] = None
    lunchHabit: Optional[str] = None 


class OfficeWorkerProfileOut(BaseModel):
    selectedDays: List[str]
    workHours: dict
    commuteType: Optional[str]
    lunchHabit: Optional[str]


class OutdoorWorkerProfileIn(BaseModel):
    workType: Optional[str] = None
    workHours: Optional[dict] = None    # { "start": "08:00", "end": "16:00" }
    breakPreference: Optional[str] = None


class OutdoorWorkerProfileOut(BaseModel):
    workType: Optional[str] = None
    workHours: dict
    breakPreference: Optional[str] = None


class HomeBasedIn(BaseModel):
    activities: Optional[List[str]] = None
    preferredTimes: Optional[List[str]] = None


class HomeBasedOut(BaseModel):
    activities: List[str]
    preferredTimes: List[str]


class StudentProfileIn(BaseModel):
    selectedDays: list[str]
    commuteType: str
    classHours: TimeRange
    hasOutdoorActivities: str
    activityHours: Optional[TimeRange] = None  

class StudentProfileOut(BaseModel):
    pass