from pydantic import BaseModel

class UserCreate(BaseModel):
    phone: str

class UserOut(BaseModel):
    id: int
    phone: str
    user_code: str

    class Config:
        orm_mode = True