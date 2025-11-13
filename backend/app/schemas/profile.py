from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    user_type: str

class UserLogin(BaseModel):
    username: str

class UserRead(BaseModel):
    id: int
    username: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    user_type: str