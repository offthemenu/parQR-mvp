from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserRegisterRequest(BaseModel):
    phone_number: str

class UserResponse(BaseModel):
    id: int
    user_code: str
    qr_code_id: Optional[str] = None
    created_at: datetime
    # Note: phone_number deliberately excluded for privacy
    
    model_config = {"from_attributes": True}

class UserPublicResponse(BaseModel):
    """Ultra-minimal user data for public API calls"""
    user_code: str
    qr_code_id: Optional[str] = None
    
    model_config = {"from_attributes": True}