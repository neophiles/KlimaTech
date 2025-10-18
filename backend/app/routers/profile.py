from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional
from app.db import get_session
from app.models import UserProfile
from pydantic import BaseModel
from app.schemas.profile import UserCreate

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
        phone_number=user.phone_number,
        lat=user.lat,
        lon=user.lon
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
def login_user(username: str, session: Session = Depends(get_session)):
    user = session.exec(
        select(UserProfile).where(UserProfile.username == username)
    ).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {"message": "Login successful", "user_id": user.id}
