from pydantic import BaseModel

class CarCreate(BaseModel):
    license_plate: str
    brand: str
    model: str
    user_id: int

class CarOut(BaseModel):
    id: int
    license_plate: str

    class Config:
        orm_mode = True