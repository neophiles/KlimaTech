from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional, List
from app.db import get_session

from app.schemas.profile import UserCreate, UserLogin, UserRead, UserEdit
from app.schemas.user_type import (
                                OfficeWorkerProfileIn,
                                OfficeWorkerProfileOut,
                                OutdoorWorkerProfileIn,
                                OutdoorWorkerProfileOut,
                                HomeBasedIn,
                                HomeBasedOut,
                                StudentProfileIn,
                                StudentProfileOut
                            )
from app.models import (
                    UserProfile,
                    StudentProfile, 
                    OutdoorWorkerProfile, 
                    OfficeWorkerProfile, 
                    HomeBasedProfile
                    )


from app.crud.profile import (
    get_all_users,
    add_user,
    get_user,
    delete_user,
    update_user,
    find_by_username,
    create_or_update_student_profile,
    get_student_profile,
    create_or_update_outdoor_worker_profile,
    get_outdoor_worker_profile,
    create_or_update_office_worker_profile,
    get_office_worker_profile,
    create_or_update_home_based_profile,
    get_home_based_profile,
)

router = APIRouter(prefix="/user", tags=["Users"])

# TODO: Fix response models

@router.get("/all", response_model=list[UserRead])
async def get_all_users_route(session: Session = Depends(get_session)):
    return get_all_users(session)


@router.post("/add", response_model=UserRead)
async def add_user_route(user: UserCreate, session: Session = Depends(get_session)):
    return add_user(session, user)


@router.get("/{user_id}", response_model=UserRead)
async def get_user_route(user_id: int, session: Session = Depends(get_session)):
    user = get_user(session, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_route(user_id: int, session: Session = Depends(get_session)):
    return delete_user(session, user_id)


@router.patch("/{user_id}", response_model=UserRead)
async def update_user_route(user_id: int, user_data: UserEdit, session: Session = Depends(get_session)):
    return update_user(session, user_id, user_data)


@router.post("/login")
def login_user_route(data: UserLogin, session: Session = Depends(get_session)):
    user = find_by_username(session, data.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
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


@router.api_route("/student/{user_id}", methods=["POST", "PUT"], response_model=StudentProfileOut)
def create_or_update_student_profile_route(user_id: int, data: StudentProfileIn, session: Session = Depends(get_session)):
    return create_or_update_student_profile(session, user_id, data)


@router.get("/student/{user_id}", response_model=StudentProfileOut)
def get_student_profile_route(user_id: int, session: Session = Depends(get_session)):
    return get_student_profile(session, user_id)


@router.api_route("/outdoor-worker/{user_id}", methods=["POST", "PUT"], response_model=OutdoorWorkerProfileIn)
def create_or_update_outdoor_worker_profile_route(user_id: int, data: dict, session: Session = Depends(get_session)):
    return create_or_update_outdoor_worker_profile(session, user_id, data)


@router.get("/outdoor-worker/{user_id}", response_model=OutdoorWorkerProfileOut)
def get_outdoor_worker_profile_route(user_id: int, session: Session = Depends(get_session)):
    return get_outdoor_worker_profile(session, user_id)


@router.api_route("/office-worker/{user_id}", methods=["POST", "PUT"], response_model=OfficeWorkerProfileIn)
def create_or_update_office_worker_profile_route(
    user_id: int,
    payload: OfficeWorkerProfileIn,
    session: Session = Depends(get_session),
):
    return create_or_update_office_worker_profile(session, user_id, payload)


@router.get("/office-worker/{user_id}", response_model=OfficeWorkerProfileOut)
def get_office_worker_profile_route(user_id: int, session: Session = Depends(get_session)):
    return get_office_worker_profile(session, user_id)


@router.api_route("/home-based/{user_id}", methods=["POST", "PUT"], response_model=HomeBasedIn)
def create_or_update_home_based_profile_route(
    user_id: int,
    payload: HomeBasedIn,
    session: Session = Depends(get_session),
):
    return create_or_update_home_based_profile(session, user_id, payload)


@router.get("/home-based/{user_id}", response_model=HomeBasedOut)
def get_home_based_profile_route(user_id: int, session: Session = Depends(get_session)):
    return get_home_based_profile(session, user_id)