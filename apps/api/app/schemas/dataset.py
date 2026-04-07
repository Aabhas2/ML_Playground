from pydantic import BaseModel 
from app.db.models import UploadStatus
from typing import List, Optional, Dict, Union, Any
import uuid 

class DatasetUploadResponse(BaseModel): 
    dataset_id: uuid.UUID
    filename: str 
    status: UploadStatus

class TopValue(BaseModel): 
    value: str 
    count: int

class NumericStats(BaseModel): 
    mean: Optional[float] 
    min: Optional[float]
    median: Optional[float]
    max: Optional[float] 
    std: Optional[float]

class CategoricalStats(BaseModel): 
    top_value: Optional[List[TopValue]]
    unique_count: Optional[int] 

class ColumnProfile(BaseModel): 
    name: str 
    dtype: str 
    detected_type: str 
    missing_count: int 
    missing_percentage: float 
    unique_count: int
    nullable: bool
    stats: Optional[Union[NumericStats, CategoricalStats]]

class DatasetProfile(BaseModel): 
    dataset_id: uuid.UUID 
    row_count: int 
    column_count: int 
    columns: List[ColumnProfile]
    preview_rows: List[Dict[str, Any]]