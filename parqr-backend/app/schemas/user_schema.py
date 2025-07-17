from pydantic import BaseModel

class UserCreate(BaseModel):
    phone_number: str

class UserOut(BaseModel):
    id: int
    phone_number: str
    user_code: str

    class Config:
        orm_mode = True