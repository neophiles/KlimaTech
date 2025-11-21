from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.db import get_session
from app.models import UserProfile
from app.schemas.profile import UserCreate, UserRead
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserRead)
async def register(user: UserCreate, session: Session = Depends(get_session)):
    """Register a new user"""
    existing_user = session.exec(
        select(UserProfile).where(UserProfile.username == user.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Hash password
    password_hash = hash_password(user.password)
    
    new_user = UserProfile(
        username=user.username,
        password_hash=password_hash,
        lat=user.lat,
        lon=user.lon,
        user_type=user.user_type,
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    return new_user


@router.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """Login and get access token"""
    user = session.exec(
        select(UserProfile).where(UserProfile.username == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "lat": user.lat,
            "lon": user.lon,
            "user_type": user.user_type,
        }
    }


@router.get("/me", response_model=UserRead)
async def get_me(current_user: UserProfile = Depends(get_current_user)):
    """Get current user info"""
    return current_user
