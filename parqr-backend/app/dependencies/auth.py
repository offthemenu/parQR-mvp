from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.user import User

def get_current_user(db: Session = Depends(get_db)) -> User:
    user = db.query(User).filter(User.id == 1).first()  # Hardcoded for now
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
