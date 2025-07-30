from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CarRegisterRequest(BaseModel):
    license_plate: str
    car_brand: str
    car_model: str

class CarResponse(BaseModel):
    id: int
    license_plate: str
    car_brand: str
    car_model: str
    created_at: datetime
    # Note: owner_id excluded for privacy
    
    model_config = {"from_attributes": True}

class CarPublicResponse(BaseModel):
    """Minimal car data for public API calls"""
    car_id: int
    car_brand: str
    car_model: str
    
    model_config = {"from_attributes": True}
    
    @classmethod
    def from_car(cls, car):
        return cls(
            car_id=car.id,
            car_brand=car.car_brand,
            car_model=car.car_model
        )