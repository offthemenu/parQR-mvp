from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.schemas.parking_schema import ParkingSessionCreate, ParkingSessionOut, ParkingSessionEnd
from app.models import parking_session as parking_model
from app.db.base import get_db
from app.dependencies.auth import get_current_car, get_current_user
from fastapi import HTTPException

router = APIRouter(prefix="/v01/parking")

@router.post("/start", response_model=ParkingSessionOut)
def start_parking(
    session_data: ParkingSessionCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    current_car = Depends(get_current_car)
):
    parking_data = session_data.model_dump()
    new_session = parking_model.ParkingSession(
        **parking_data,
        user_id=current_user.id,
        car_id=current_car.id,
        start_time=datetime.now(timezone.utc)
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.post("/end", response_model=ParkingSessionOut)
def end_parking(
    data: ParkingSessionEnd,
    db: Session = Depends(get_db)
):
    session = db.query(parking_model.ParkingSession).filter_by(id=data.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Parking session not found")
    session.end_time = datetime.now(timezone.utc)
    db.commit()
    db.refresh(session)
    return session