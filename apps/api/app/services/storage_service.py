import os, uuid 
import shutil
from pathlib import Path 
from fastapi import UploadFile 
from app.core.config import settings 

def save_file(file: UploadFile) -> str: 
    # check if storage path exists 
    storage_path = Path(settings.STORAGE_PATH) / "datasets" 
    storage_path.mkdir(parents=True, exist_ok=True) 

    # Generate unique filename 
    file_ext = Path(file.filename).suffix 
    unique_name = f"{uuid.uuid4()}{file_ext}"
    file_path = storage_path / unique_name 

    # write file to disk 
    with open(file_path, "wb") as f: 
        shutil.copyfileobj(file.file, f) 

    return str(file_path)   