from fastapi import APIRouter, Depends  
from sqlalchemy.orm import Session 
from app.db.session import get_db 
from app.api.routes.health import router as health_router 
from app.api.routes import datasets
from app.api.routes import pipelines 
from app.api.routes import viz 
from app.api.routes import models 

api_router = APIRouter() 
api_router.include_router(health_router)
api_router.include_router(datasets.router, prefix="/datasets")
api_router.include_router(pipelines.router, prefix="/pipelines") 
api_router.include_router(viz.router, prefix="/datasets")
api_router.include_router(models.router, prefix="/models")