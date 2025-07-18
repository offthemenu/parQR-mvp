from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.car_schema import CarCreate, CarOut
from app.db.base import get_db
from app.models import car as car_model
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/v01/car")

@router.post("/register", response_model=CarOut)
def register_car(
    car: CarCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    car_data = car.model_dump()
    new_car = car_model.Car(
        **car_data,
        owner_id=current_user.id
    )
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car