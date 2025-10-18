from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    lat: Optional[float] = None
    lon: Optional[float] = None

class UserLogin(BaseModel):
    username: str