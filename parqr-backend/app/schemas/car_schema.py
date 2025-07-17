from pydantic import BaseModel

class CarCreate(BaseModel):
    license_plate: str
    car_brand: str
    car_model: str

class CarOut(BaseModel):
    id: int
    license_plate: str

    class Config:
        orm_mode = True