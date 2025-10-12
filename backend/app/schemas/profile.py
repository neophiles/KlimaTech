from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    phone_number: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None