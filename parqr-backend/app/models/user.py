from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base
from datetime import datetime, timezone
import uuid

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(20), unique=True, nullable=False)
    user_code = Column(String(50), unique=True, default=lambda: str(uuid.uuid4()))
    qr_code_id = Column(String(50), unique=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
