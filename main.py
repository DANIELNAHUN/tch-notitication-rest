from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from config.bd import SessionLocal
from sqlalchemy.orm import Session

# USERS
from routes import (user, notifications)

app = FastAPI(
    title="Notification System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    user.router,
    prefix='/api/user')

app.include_router(
    notifications.router,
    prefix="/api/notifications"
)