from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.car import Car
from app.models.user import User
from app.schemas.car_schema import CarRegisterRequest, CarResponse, CarPublicResponse
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/v01/car", tags=["car"])

@router.post("/register", response_model=CarResponse)
def register_car(
    car_data: CarRegisterRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if license plate already exists globally (must be unique)
    existing_car = db.query(Car).filter(
        Car.license_plate == car_data.license_plate
    ).first()
    
    if existing_car:
        raise HTTPException(status_code=400, detail="License plate already registered")
    
    model_data = car_data.model_dump()
    model_data['owner_id'] = current_user.id
    new_car = Car(**model_data)
    
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    
    return new_car

@router.get("/my-cars", response_model=list[CarResponse])
def get_user_cars(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's cars - owner_id excluded from response"""
    cars = db.query(Car).filter(Car.owner_id == current_user.id).all()
    return cars

@router.get("/public/{car_id}", response_model=CarPublicResponse)
def get_public_car_info(
    car_id: int,
    db: Session = Depends(get_db)
):
    """Get minimal public car information"""
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    return CarPublicResponse.from_car(car)