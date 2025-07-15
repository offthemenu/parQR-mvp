from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.car_schema import CarCreate, CarOut
from app.db.base import get_db
from app.models import car as car_model
from pydantic import model_dump

router = APIRouter(prefix="/v01/car")

@router.post("/register", response_model=CarOut)
def register_car(car: CarCreate, db: Session = Depends(get_db)):
    new_car = car_model.Car(**model_dump(car))
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car