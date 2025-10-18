from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    user_type: str
    lat: Optional[float] = None
    lon: Optional[float] = None

class UserLogin(BaseModel):
    username: str