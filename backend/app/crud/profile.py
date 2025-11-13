from sqlmodel import Session, select
from fastapi import HTTPException, status
from typing import Optional

from app.models import (
    UserProfile,
    StudentProfile,
    OutdoorWorkerProfile,
    OfficeWorkerProfile,
    HomeBasedProfile,
)
from app.schemas.profile import UserCreate, UserEdit
from app.schemas.user_type import (
    StudentProfileIn,
)

PH_TZ = None  # placeholder if needed elsewhere


def get_all_users(session: Session) -> list[UserProfile]:
    return session.exec(select(UserProfile)).all()


def add_user(session: Session, user: UserCreate) -> UserProfile:
    existing_user = session.exec(
        select(UserProfile).where(UserProfile.username == user.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    new_user = UserProfile(
        username=user.username,
        user_type=user.user_type,
        lat=user.lat,
        lon=user.lon,
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


def get_user(session: Session, user_id: int) -> Optional[UserProfile]:
    return session.get(UserProfile, user_id)


def delete_user(session: Session, user_id: int) -> None:
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    session.delete(user)
    session.commit()
    return None


def update_user(session: Session, user_id: int, user_data: UserEdit) -> UserProfile:
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user_data.username is not None:
        user.username = user_data.username
    if user_data.user_type is not None:
        user.user_type = user_data.user_type
    if user_data.lat is not None:
        user.lat = user_data.lat
    if user_data.lon is not None:
        user.lon = user_data.lon

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def find_by_username(session: Session, username: str) -> Optional[UserProfile]:
    return session.exec(select(UserProfile).where(UserProfile.username == username)).first()


def create_or_update_student_profile(session: Session, user_id: int, data: StudentProfileIn) -> StudentProfile:
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    existing = session.exec(select(StudentProfile).where(StudentProfile.user_id == user_id)).first()

    payload = StudentProfile(
        user_id=user_id,
        days_on_campus=",".join(data.selectedDays),
        commute_mode=data.commuteType,
        class_hours=f"{data.classHours.start}-{data.classHours.end}",
        has_outdoor_activities=(data.hasOutdoorActivities == "Yes"),
        outdoor_hours=(
            f"{data.activityHours.start}-{data.activityHours.end}"
            if data.hasOutdoorActivities == "Yes"
            else None
        ),
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


def get_student_profile(session: Session, user_id: int):
    profile = session.exec(select(StudentProfile).where(StudentProfile.user_id == user_id)).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

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


def create_or_update_outdoor_worker_profile(session: Session, user_id: int, data: dict):
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    existing = session.exec(select(OutdoorWorkerProfile).where(OutdoorWorkerProfile.user_id == user_id)).first()

    payload = OutdoorWorkerProfile(
        user_id=user_id,
        work_type=data.get("workType"),
        work_hours=f"{data['workHours']['start']}-{data['workHours']['end']}",
        break_type=data.get("breakPreference")
    )

    if existing:
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(existing, field, value)
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    session.add(payload)
    session.commit()
    session.refresh(payload)
    return payload


def get_outdoor_worker_profile(session: Session, user_id: int):
    profile = session.exec(select(OutdoorWorkerProfile).where(OutdoorWorkerProfile.user_id == user_id)).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outdoor worker profile not found")

    start, end = profile.work_hours.split("-")
    return {
        "user_id": profile.user_id,
        "workType": profile.work_type,
        "workHours": {"start": start, "end": end},
        "breakPreference": profile.break_type,
    }


def create_or_update_office_worker_profile(session: Session, user_id: int, payload):
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

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


def get_office_worker_profile(session: Session, user_id: int):
    profile = session.exec(select(OfficeWorkerProfile).where(OfficeWorkerProfile.user_id == user_id)).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    if profile.work_hours and "-" in profile.work_hours:
        work_start, work_end = profile.work_hours.split("-", 1)
    else:
        work_start, work_end = "", ""

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


def create_or_update_home_based_profile(session: Session, user_id: int, payload):
    user = session.get(UserProfile, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

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


def get_home_based_profile(session: Session, user_id: int):
    profile = session.exec(select(HomeBasedProfile).where(HomeBasedProfile.user_id == user_id)).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    return {
        "activities": profile.outdoor_activities.split(",") if profile.outdoor_activities else [],
        "preferredTimes": profile.preferred_times.split(",") if profile.preferred_times else []
    }