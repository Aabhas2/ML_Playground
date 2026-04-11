from sqlalchemy.orm import Session 
from app.db.models import Dataset, UploadStatus 

def create_dataset(db: Session, filename: str, file_path: str) -> Dataset: 
    db_dataset = Dataset(
        filename=filename, 
        file_path=file_path, 
        current_status=UploadStatus.UPLOADED, 
        profile_data=None 
    )
    
    db.add(db_dataset) 
    db.commit() 
    db.refresh(db_dataset) 

    return db_dataset 


def get_dataset(db: Session,dataset_id) -> Dataset | None: 
    return db.query(Dataset).filter(Dataset.id == dataset_id).first()
    

def update_dataset_profile(db: Session, dataset_id, profile_data: dict) -> Dataset: 
    dataset = get_dataset(db, dataset_id) 

    if not dataset: 
        raise ValueError("Dataset not found")

    dataset.profile_data = profile_data 
    dataset.current_status = UploadStatus.PROFILED

    db.commit() 
    db.refresh(dataset) 

    return dataset 