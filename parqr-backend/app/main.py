from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/ping")
def health_check():
    res = {"status" : "pong" }
    return res 