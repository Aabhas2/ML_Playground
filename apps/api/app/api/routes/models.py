from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session 
import uuid 

from app.db.session import get_db 
from app.db import crud 
from app.schemas.model import ModelTrainRequest, ModelTrainResponse 
from app.services.model_service import ModelService 
from app.services.dataset_service import load_data  

router = APIRouter() 

@router.post("/train", response_model=ModelTrainResponse) 
def train_model(req: ModelTrainRequest, db: Session = Depends(get_db)): 
    dataset = crud.get_dataset(db, req.dataset_id) 
    if not dataset: 
        raise HTTPException(status_code=404, detail="Dataset not found") 

    try: 
        df, _ = load_data(dataset.file_path) 
        result = ModelService().train_model(df, req) 
        return result  
    except ValueError as e: 
        raise HTTPException(status_code=400, detail=str(e)) 

    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Training job failed: {str(e)}") 

    