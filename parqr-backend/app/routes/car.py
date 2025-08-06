from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.car import Car
from app.models.user import User
from app.schemas.car_schema import CarRegisterRequest, CarResponse, CarPublicResponse
from app.dependencies.auth import get_current_user
import logging

logger = logging.getLogger(__name__)

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
        raise HTTPException(
            status_code=400,
            detail={
                "error": "duplicate_license_plate",
                "message": "This license plate is already registered in the system"
            }
        )

    try:
        model_data = car_data.model_dump()
        model_data['owner_id'] = current_user.id

        logger.info(f"Car registration data: {model_data}")
        logger.info(f"Creating car for user_id: {current_user.id}")

        new_car = Car(**model_data)

        db.add(new_car)
        db.commit()
        db.refresh(new_car)

        logger.info(f"Car registered successfully with ID: {new_car.id}, license_plate: {new_car.license_plate}")
        return new_car

    except Exception as e:
        db.rollback()
        logger.error(f"Car registration failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")

@router.get("/my-cars", response_model=list[CarResponse])
def get_user_cars(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's cars - owner_id excluded from response"""
    logger.info(f"Fetching cars for user_id: {current_user.id}")
    
    cars = db.query(Car).filter(Car.owner_id == current_user.id).all()
    
    logger.info(f"Found {len(cars)} cars for user_id: {current_user.id}")
    return cars

@router.get("/public/{car_id}", response_model=CarPublicResponse)
def get_public_car_info(
    car_id: int,
    db: Session = Depends(get_db)
):
    """Get minimal public car information"""
    logger.info(f"Public car info request for car_id: {car_id}")
    
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        logger.warning(f"Car not found: {car_id}")
        raise HTTPException(status_code=404, detail="Car not found")
    
    logger.info(f"Returning public info for car: {car.license_plate}")
    return CarPublicResponse.from_car(car)