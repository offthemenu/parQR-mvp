from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserRegisterRequest(BaseModel):
    phone_number: str
    signup_country_iso: str

class UserResponse(BaseModel):
    id: int
    user_code: str
    qr_code_id: Optional[str] = None
    created_at: datetime
    signup_country_iso: str
    # Note: phone_number deliberately excluded for privacy
    
    model_config = {"from_attributes": True}

class UserPublicResponse(BaseModel):
    """Ultra-minimal user data for public API calls"""
    user_code: str
    qr_code_id: Optional[str] = None
    signup_country_iso: str
    
    model_config = {"from_attributes": True}