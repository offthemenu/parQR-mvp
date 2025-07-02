from sqlalchemy.orm import declarative_base

Base = declarative_base()

from app.models.user import User
from app.models.car import Car
from app.models.parking_session import ParkingSession