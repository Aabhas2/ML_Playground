from fastapi import UploadFile, File, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session 
from app.db.models import  UploadStatus
from app.db.session import get_db
from app.services.storage_service import save_file 
from app.services.dataset_service import profile_dataset
from app.db.crud import update_dataset_profile, get_dataset, create_dataset

router = APIRouter() 
# app = FastAPI()   

# POST /datasets/upload 
@router.post("/datasets/upload") 
def upload_dataset(db: Session = Depends(get_db), dataset: UploadFile = File(...)): 
    if not dataset.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Invalid data type")
    
    # save_file -> file_path (str) 
    file_path = save_file(dataset)

    # Creating dataset 
    db_dataset = create_dataset(db, dataset.filename, file_path)

    try:
        # Profiling the dataset 
        profiled_dataset = profile_dataset(file_path) 

        # Update dataset profile in DB 
        db_dataset = update_dataset_profile(db, db_dataset.id, profiled_dataset)

    except Exception as e: 
        db_dataset.current_status = UploadStatus.ERROR
        db.commit() 
        raise HTTPException(status_code=500, detail=f"Profiling data failed: {str(e)}")
        
    return {
        "dataset_id": db_dataset.id, 
        "filename": db_dataset.filename, 
        "status": db_dataset.current_status
    }

# GET /datasets/{dataset_id}/profile 
@router.get("/datasets/{dataset_id}/profile") 
def get_dataset_profile(dataset_id: str, db: Session = Depends(get_db)): 
    dataset = get_dataset(db, dataset_id) 

    if not dataset:  
        raise HTTPException(status_code=404, detail="Dataset not found") 
    
    if not dataset.profile_data: 
        raise HTTPException(status_code=400, detail="Profile not ready") 
    
    return dataset.profile_data 
