from fastapi import APIRouter, Depends  
from sqlalchemy.orm import Session 
from app.db.session import get_db 
from app.api.routes.health import router as health_router 

api_router = APIRouter() 
api_router.include_router(health_router)