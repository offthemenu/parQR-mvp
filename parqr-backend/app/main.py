from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

Base.metadata.create_all(bind=engine)

from routes import health_check

app.include_router(health_check.router, prefix= "/api")