from sqlalchemy import Column, Integer, DateTime, ForeignKey, String, Float
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime, timezone

class ParkingSession(Base):
    __tablename__ = 'parking_sessions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    car_id = Column(Integer, ForeignKey('cars.id'), nullable=False)
    start_time = Column(DateTime, default=datetime.now(timezone.utc))
    end_time = Column(DateTime, nullable=True)
    location = Column(String(100), nullable=True)
    longitude = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)

    user = relationship('User', backref='parking_sessions')
    car = relationship('Car', backref='parking_sessions')
