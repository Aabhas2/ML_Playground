from sqlalchemy import create_engine, text 
from sqlalchemy.orm import sessionmaker 
from app.core.config import settings 
from typing import Generator

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True) 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 

def ping_db() -> None: 
    # Lightweight connectivity check 
    with engine.connect() as conn: 
        conn.execute(text("SELECT 1"))

def get_db() -> Generator: 
    db = SessionLocal() 
    try: 
        yield db 
    finally: 
        db.close() 