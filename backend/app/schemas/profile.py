from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    user_type: str

class UserEdit(BaseModel):
    username: Optional[str] = None
    user_type: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    user_type: Optional[str] = None