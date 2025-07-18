from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ParkingSessionCreate(BaseModel):
    location: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None

class ParkingSessionEnd(BaseModel):
    session_id: int

class ParkingSessionOut(BaseModel):
    id: int
    user_id: int
    car_id: int
    start_time: datetime
    end_time: Optional[datetime]

    class Config:
        orm_mode = True