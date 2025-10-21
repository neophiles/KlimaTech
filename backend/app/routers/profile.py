from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional, List
from app.db import get_session
from app.models import UserProfile, StudentProfile, OutdoorWorkerProfile, OfficeWorkerProfile, HomeBasedProfile
from pydantic import BaseModel
from app.schemas.profile import UserCreate, UserLogin

router = APIRouter(prefix="/user", tags=["Users"])


@router.get("/all", response_model=list[UserProfile])
async def get_all_users(session: Session = Depends(get_session)):
    users = session.exec(select(UserProfile)).all()
    return users


@router.post("/add", response_model=UserProfile)
async def add_user(user: UserCreate, session: Session = Depends(get_session)):
    # Check if username already exists
    existing_user = session.exec(
        select(UserProfile).where(UserProfile.username == user.username)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    new_user = UserProfile(
        username=user.username,
        user_type=user.user_type,
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user



@router.get("/{user_id}", response_model=UserProfile)
async def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    session.delete(user)
    session.commit()
    return


@router.put("/{user_id}", response_model=UserProfile)
async def update_user(user_id: int, user_data: UserCreate, session: Session = Depends(get_session)):
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.username = user_data.username
    user.user_type = user_data.user_type

    session.add(user)
    session.commit()
    session.refresh(user)
    return user



@router.post("/login")
def login_user(data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(
        select(UserProfile).where(UserProfile.username == data.username)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "lat": user.lat,
            "lon": user.lon,
            "user_type": user.user_type
        }
    }


@router.api_route("/student/{user_id}", methods=["POST", "PUT"], response_model=StudentProfile)
def create_or_update_student_profile(user_id: int, data: dict, session: Session = Depends(get_session)):
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = session.exec(select(StudentProfile).where(StudentProfile.user_id == user_id)).first()

    payload = StudentProfile(
        user_id=user_id,
        days_on_campus=",".join(data["selectedDays"]),
        commute_mode=data["commuteType"],
        class_hours=f"{data['classHours']['start']}-{data['classHours']['end']}",
        has_outdoor_activities=(data["hasOutdoorActivities"] == "Yes"),
        outdoor_hours=f"{data['activityHours']['start']}-{data['activityHours']['end']}" if data["hasOutdoorActivities"] == "Yes" else None
    )

    if existing:
        # update existing
        for field, value in payload.dict(exclude_unset=True).items():
            setattr(existing, field, value)
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    session.add(payload)
    session.commit()
    session.refresh(payload)
    return payload


@router.get("/student/{user_id}")
def get_student_profile(user_id: int, session: Session = Depends(get_session)):
    profile = session.exec(select(StudentProfile).where(StudentProfile.user_id == user_id)).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Parse DB strings into frontend-friendly format
    class_start, class_end = (profile.class_hours or "-").split("-")
    activity_start, activity_end = ("-", "-")
    if profile.outdoor_hours:
        activity_start, activity_end = profile.outdoor_hours.split("-")

    return {
        "selectedDays": profile.days_on_campus.split(",") if profile.days_on_campus else [],
        "commuteType": profile.commute_mode,
        "classHours": {"start": class_start, "end": class_end},
        "hasOutdoorActivities": "Yes" if profile.has_outdoor_activities else "No",
        "activityHours": {"start": activity_start, "end": activity_end} if profile.has_outdoor_activities else None
    }


class OutdoorWorkerProfileIn(BaseModel):
    workType: Optional[str] = None
    workHours: Optional[dict] = None    # { "start": "08:00", "end": "16:00" }
    breakPreference: Optional[str] = None


class OutdoorWorkerProfileOut(BaseModel):
    workType: Optional[str] = None
    workHours: dict
    breakPreference: Optional[str] = None

@router.api_route("/outdoor-worker/{user_id}", methods=["POST", "PUT"], response_model=OutdoorWorkerProfileIn)
def create_or_update_outdoor_worker_profile(user_id: int, data: dict, session: Session = Depends(get_session)):
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = session.exec(
        select(OutdoorWorkerProfile).where(OutdoorWorkerProfile.user_id == user_id)
    ).first()

    payload = OutdoorWorkerProfile(
        user_id=user_id,
        work_type=data.get("workType"),
        work_hours=f"{data['workHours']['start']}-{data['workHours']['end']}",
        break_type=data.get("breakPreference")
    )


    if existing:
        for field, value in payload.dict(exclude_unset=True).items():
            setattr(existing, field, value)
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    session.add(payload)
    session.commit()
    session.refresh(payload)
    return payload


@router.get("/outdoor-worker/{user_id}", response_model=OutdoorWorkerProfileOut)
def get_outdoor_worker_profile(user_id: int, session: Session = Depends(get_session)):
    profile = session.exec(
        select(OutdoorWorkerProfile).where(OutdoorWorkerProfile.user_id == user_id)
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Outdoor worker profile not found")

    start, end = profile.work_hours.split("-")

    return {
        "user_id": profile.user_id,
        "workType": profile.work_type,
        "workHours": {"start": start, "end": end},
        "breakPreference": profile.break_type,
    }


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



@router.api_route("/office-worker/{user_id}", methods=["POST", "PUT"], response_model=OfficeWorkerProfileIn)
def create_or_update_office_worker_profile(
    user_id: int,
    payload: OfficeWorkerProfileIn,
    session: Session = Depends(get_session),
):
    """
    Create or update OfficeWorkerProfile for user_id.
    Accepts JSON body matching OfficeWorkerProfileIn.
    """

    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prepare fields
    office_days = ",".join(payload.selectedDays) if payload.selectedDays else None

    work_hours = None
    if payload.workHours:
        start = payload.workHours.get("start") or ""
        end = payload.workHours.get("end") or ""
        work_hours = f"{start}-{end}" if (start or end) else None

    commute_mode = payload.commuteType or None

    goes_out_for_lunch = None
    if payload.lunchHabit:
        if "walk" in payload.lunchHabit.lower() or "commute" in payload.lunchHabit.lower():
            goes_out_for_lunch = True
        elif "inside" in payload.lunchHabit.lower() or "baon" in payload.lunchHabit.lower():
            goes_out_for_lunch = False


    existing = session.exec(select(OfficeWorkerProfile).where(OfficeWorkerProfile.user_id == user_id)).first()

    if existing:
        existing.office_days = office_days
        existing.work_hours = work_hours
        existing.commute_mode = commute_mode
        existing.goes_out_for_lunch = goes_out_for_lunch
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    new = OfficeWorkerProfile(
        user_id=user_id,
        office_days=office_days,
        work_hours=work_hours,
        commute_mode=commute_mode,
        goes_out_for_lunch=goes_out_for_lunch,
    )
    session.add(new)
    session.commit()
    session.refresh(new)
    return new


@router.get("/office-worker/{user_id}", response_model=OfficeWorkerProfileOut)
def get_office_worker_profile(user_id: int, session: Session = Depends(get_session)):
    profile = session.exec(
        select(OfficeWorkerProfile).where(OfficeWorkerProfile.user_id == user_id)
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Handle work hours safely
    if profile.work_hours and "-" in profile.work_hours:
        work_start, work_end = profile.work_hours.split("-", 1)
    else:
        work_start, work_end = "", ""

    # Match frontend exact strings
    if profile.goes_out_for_lunch is True:
        lunch_habit = "Yes, I walk/commute out"
    elif profile.goes_out_for_lunch is False:
        lunch_habit = "No, I eat inside the building / bring baon"
    else:
        lunch_habit = ""

    return {
        "selectedDays": profile.office_days.split(",") if profile.office_days else [],
        "workHours": {"start": work_start, "end": work_end},
        "commuteType": profile.commute_mode or "",
        "lunchHabit": lunch_habit,
    }




class HomeBasedIn(BaseModel):
    activities: Optional[List[str]] = None
    preferredTimes: Optional[List[str]] = None

class HomeBasedOut(BaseModel):
    activities: List[str]
    preferredTimes: List[str]


@router.api_route("/home-based/{user_id}", methods=["POST", "PUT"], response_model=HomeBasedIn)
def create_or_update_home_based_profile(
    user_id: int,
    payload: HomeBasedIn,
    session: Session = Depends(get_session),
):
    """
    Create or update HomeBasedProfile for a user.
    Expects JSON:
      { "activities": [...], "preferredTimes": [...] }
    Stored as CSV strings in outdoor_activities and preferred_times.
    """
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    outdoor_activities = ",".join(payload.activities) if payload.activities else None
    preferred_times = ",".join(payload.preferredTimes) if payload.preferredTimes else None

    existing = session.exec(select(HomeBasedProfile).where(HomeBasedProfile.user_id == user_id)).first()

    if existing:
        existing.outdoor_activities = outdoor_activities
        existing.preferred_times = preferred_times
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    new = HomeBasedProfile(
        user_id=user_id,
        outdoor_activities=outdoor_activities,
        preferred_times=preferred_times,
    )
    session.add(new)
    session.commit()
    session.refresh(new)
    return new


@router.get("/home-based/{user_id}", response_model=HomeBasedOut)
def get_home_based_profile(user_id: int, session: Session = Depends(get_session)):
    profile = session.exec(select(HomeBasedProfile).where(HomeBasedProfile.user_id == user_id)).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {
        "activities": profile.outdoor_activities.split(",") if profile.outdoor_activities else [],
        "preferredTimes": profile.preferred_times.split(",") if profile.preferred_times else []
    }