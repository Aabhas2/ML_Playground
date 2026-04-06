import uuid
from datetime import datetime
import enum

from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import JSONB, UUID

class UploadStatus(str, enum.Enum): 
    UPLOADED = "uploaded" 
    PROFILED = "profiled" 
    ERROR = "error" 

class Base(DeclarativeBase): 
    pass 

class Dataset(Base): 
    __tablename__ = "datasets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False) 
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    profile_data = Column(JSONB, nullable=True)
    current_status = Column(Enum(UploadStatus, name="upload_status"), nullable=False, default=UploadStatus.UPLOADED)