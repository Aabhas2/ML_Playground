from pydantic import BaseModel
from typing import List, Optional, Dict, Any 
import uuid 

class PipelineOperation(BaseModel): 
    type: List[str] 
    params: Dict[str, Any] = {} 

class PipelineCreateRequest(BaseModel): 
    dataset_id: uuid.UUID 
    name: Optional[str] = None 

class PipelinePreviewResponse(BaseModel): 
    rows: int 
    columns: int 
    preview: List[Dict[str, Any]] 

class PipelineRunResponse(BaseModel): 
    pipeline_id: uuid.UUID 
    rows: int 
    columns: int 
    message: str 


    