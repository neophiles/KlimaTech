from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional, List
from app.db import get_session
from app.models import UserProfile, StudentProfile, OutdoorWorkerProfile, OfficeWorkerProfile
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


@router.post("/student/{user_id}", response_model=StudentProfile)
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


@router.post("/outdoor-worker/{user_id}", response_model=OutdoorWorkerProfile)
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


class OfficeWorkerProfileIn(BaseModel):
    selectedDays: Optional[List[str]] = None
    workHours: Optional[dict] = None    # { "start": "09:00", "end": "18:00" }
    commuteType: Optional[str] = None
    lunchHabit: Optional[str] = None 


@router.post("/office-worker/{user_id}", response_model=OfficeWorkerProfile, status_code=status.HTTP_201_CREATED)
@router.put("/office-worker/{user_id}", response_model=OfficeWorkerProfile)
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
    if payload.lunchHabit is not None:
        low = payload.lunchHabit.lower()
        if "yes" in low or "walk" in low or "commute" in low or "out" in low:
            goes_out_for_lunch = True
        elif "no" in low or "inside" in low or "bring" in low:
            goes_out_for_lunch = False
        else:
            goes_out_for_lunch = None

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