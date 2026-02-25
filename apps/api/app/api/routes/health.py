from fastapi import APIRouter 
from app.db.session import ping_db 
from app.utils.redis_client import ping_redis

router = APIRouter(tags=["health"]) 

@router.get("/health")
def health(): 
    return {"status": "ok"} 

@router.get("/health/deps") 
def health_deps(): 
    db_ok = True 
    redis_ok = True 
    db_error = None 
    redis_error = None 

    try: 
        ping_db() 
    except Exception as e: 
        db_ok = False 
        db_error = str(e) 

    try: 
        ping_redis() 
    except Exception as e: 
        redis_ok = False 
        redis_error = str(e) 


    return {
        "status": "ok" if (db_ok and redis_ok) else "degraded", 
        "db": {"ok": db_ok, "error": db_error}, 
        "redis": {"ok": redis_ok, "error": redis_error},
    }