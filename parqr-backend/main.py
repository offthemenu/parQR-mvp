from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

Base.metadata.create_all(bind=engine)

from app.routes import health_check, car, parking, user

app.include_router(health_check.router, prefix= "/api")
app.include_router(user.router, prefix= "/api")
app.include_router(car.router, prefix= "/api")
app.include_router(parking.router, prefix= "/api")