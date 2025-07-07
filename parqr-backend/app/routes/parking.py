from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.schemas.parking_schema import ParkingSessionCreate, ParkingSessionOut, ParkingSessionEnd
from app.models import parking_session as parking_model
from app.db.base import get_db
from fastapi import HTTPException

router = APIRouter(prefix="/v01/parking")

@router.post("/start", response_model=ParkingSessionOut)
def start_parking(session_data: ParkingSessionCreate, db: Session = Depends(get_db)):
    new_session = parking_model.ParkingSession(
        user_id=session_data.user_id,
        car_id=session_data.car_id,
        latitude=session_data.latitude,
        longitude=session_data.longitude,
        started_at=datetime.utcnow()
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.post("/end-parking", response_model=ParkingSessionOut)
def end_parking(data: ParkingSessionEnd, db: Session = Depends(get_db)):
    session = db.query(parking_model.ParkingSession).filter_by(id=data.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Parking session not found")
    session.ended_at = datetime.utcnow()
    db.commit()
    db.refresh(session)
    return session