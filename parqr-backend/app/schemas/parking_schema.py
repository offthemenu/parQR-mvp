from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ParkingSessionCreate(BaseModel):
    user_id: int
    car_id: int
    latitude: float
    longitude: float

class ParkingSessionEnd(BaseModel):
    session_id: int

class ParkingSessionOut(BaseModel):
    id: int
    started_at: datetime
    ended_at: Optional[datetime]

    class Config:
        orm_mode = True