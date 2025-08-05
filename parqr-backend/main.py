import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from dotenv import load_dotenv

from app.db.session import engine
from app.db.base import Base
from app.routes import car, health_check, parking, user, signup

load_dotenv(override=True)

# Database URL loaded from environment

app = FastAPI(
    title="parQR API",
    description="Privacy-first parking management API",
    version="1.0.0"
)

# Configure CORS middleware
origins = [
    "http://localhost:3000",      # React development server
    "http://localhost:19006",     # Expo development server
    "http://127.0.0.1:3000",
    "http://127.0.0.1:19006",
    "http://192.168.1.30:19006",  # Your specific IP for Expo
    "http://192.168.1.30:8081",   # Metro bundler
    "exp://192.168.1.30:8081",    # Expo scheme
    "null",                       # For local HTML files
]

# For development: Allow all origins (ONLY for development!)
if os.getenv("DEV_MODE", "false").lower() == "true":
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(health_check.router, prefix= "/api")
app.include_router(user.router, prefix= "/api")
app.include_router(car.router, prefix= "/api")
app.include_router(parking.router, prefix= "/api")
app.include_router(signup.router, prefix = "/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0",
        port=8010,
        log_level="info"
    )