from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.schemas.parking_schema import ParkingSessionCreate, ParkingSessionOut, ParkingSessionEnd
from app.models import parking_session as parking_model
from app.db.base import get_db
from app.dependencies.auth import get_current_car, get_current_user
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v01/parking")

@router.post("/start", response_model=ParkingSessionOut)
def start_parking(
    session_data: ParkingSessionCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    current_car = Depends(get_current_car)
):
    logger.info(f"Starting parking session for user_id: {current_user.id}, car_id: {current_car.id}")
    
    parking_data = session_data.model_dump()
    logger.info(f"Parking session data: {parking_data}")
    
    start_time = datetime.now(timezone.utc)
    new_session = parking_model.ParkingSession(
        **parking_data,
        user_id=current_user.id,
        car_id=current_car.id,
        start_time=start_time
    )
    
    logger.info(f"Creating parking session at {start_time}")
    
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    logger.info(f"Parking session started successfully with ID: {new_session.id}")
    return new_session

@router.post("/end", response_model=ParkingSessionOut)
def end_parking(
    data: ParkingSessionEnd,
    db: Session = Depends(get_db)
):
    logger.info(f"Ending parking session request for session_id: {data.session_id}")
    
    session = db.query(parking_model.ParkingSession).filter_by(id=data.session_id).first()
    if not session:
        logger.warning(f"Parking session not found: {data.session_id}")
        raise HTTPException(status_code=404, detail="Parking session not found")
    
    end_time = datetime.now(timezone.utc)
    session.end_time = end_time
    
    duration = end_time - session.start_time
    logger.info(f"Ending parking session {data.session_id} at {end_time}, duration: {duration}")
    
    db.commit()
    db.refresh(session)
    
    logger.info(f"Parking session ended successfully: {data.session_id}")
    return session