from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.user import User
from app.models.car import Car

def get_current_user(db: Session = Depends(get_db)) -> User:
    user = db.query(User).filter(User.id == 1).first()  # Hardcoded for now
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_current_car(db: Session = Depends(get_db)) -> Car:
    car = db.query(Car).filter(Car.id == 1).first()  # Hardcoded for now
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car