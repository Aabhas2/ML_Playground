from sqlalchemy.util import concurrency
import uuid 
from typing import List, Optional, Dict, Any

import pandas as pd 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 

from app.db.session import get_db 
from app.db import crud 
from app.services.viz_service import VizService
from app.services.dataset_service import load_data

router = APIRouter() 

@router.get("/{dataset_id}/histogram", response_model=List[Dict[str, Any]])
def get_histogram(dataset_id: uuid.UUID, column: str, bins: int = 10, db: Session = Depends(get_db)):
    dataset = crud.get_dataset(db, dataset_id) 
    if not dataset: 
        raise HTTPException(status_code=404, detail="Dataset not found") 

    df,_ = load_data(dataset.file_path)

    # Validate column existence 
    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' does not exist.")

    try: 
        if not pd.api.types.is_numeric_dtype(df[column]): 
            raise HTTPException(status_code=400, detail=f"Column '{column}' is not numeric")

        hist_data = VizService().get_histogram_data(df, column, bins) 
        return hist_data 
    except HTTPException:
        raise
    except Exception as e: 
        raise HTTPException(status_code=500, detail=str(e)) 

@router.get("/{dataset_id}/boxplot", response_model=Dict[str, Any]) 
def get_boxplot(dataset_id: uuid.UUID, column: str, db: Session = Depends(get_db)): 
    dataset = crud.get_dataset(db, dataset_id) 
    if not dataset: 
        raise HTTPException(status_code=404, detail="Dataset not found") 

    df, _ = load_data(dataset.file_path) 

    # Validate column existence 
    if column not in df.columns: 
        raise HTTPException(status_code=400, detail=f"Column '{column}' does not exist.")

    try:
        if not pd.api.types.is_numeric_dtype(df[column]): 
            raise HTTPException(status_code=400, detail=f"Column '{column}' is not numeric")
        
        boxplot_data = VizService().get_boxplot_data(df, column)
        return boxplot_data

    except HTTPException:
        raise 
    except Exception as e: 
        raise HTTPException(status_code=500, detail=str(e)) 


@router.get("/{dataset_id}/scatterplot", response_model=List[Dict[str,Any]]) 
def get_scatterplot(dataset_id: uuid.UUID, col_x: str, col_y: str, sample_limit: int = 1000, db: Session = Depends(get_db)):
    dataset = crud.get_dataset(db, dataset_id) 
    if not dataset: 
        raise HTTPException(status_code=404, detail="Dataset not found")

    df, _ = load_data(dataset.file_path) 

    # Validate column existence 
    if col_x not in df.columns or col_y not in df.columns: 
        raise HTTPException(status_code=400, detail=f"Columns '{col_x}' and '{col_y}' do not exist.")
    
    try:
        if not pd.api.types.is_numeric_dtype(df[col_x]) or not pd.api.types.is_numeric_dtype(df[col_y]):
            raise HTTPException(status_code=400, detail=f"Columns '{col_x}' and '{col_y}' must be numeric.")
        
        scatterplot_data = VizService().get_scatterplot_data(df, col_x, col_y, sample_limit) 
        return scatterplot_data 

    except HTTPException:
        raise
    except Exception as e: 
        raise HTTPException(status_code=500, detail=str(e)) 

@router.get("/{dataset_id}/correlation-matrix", response_model=Dict[str, Any])
def get_correlation_heatmap(dataset_id: uuid.UUID, db: Session = Depends(get_db)):
    dataset = crud.get_dataset(db, dataset_id) 
    if not dataset: 
        raise HTTPException(status_code=404, detail="Dataset not found")

    df, _ = load_data(dataset.file_path) 
    
    # Validate column existence 
    num_cols = [col for col in df.columns if pd.api.types.is_numeric_dtype(df[col])] 
    if not num_cols: 
        raise HTTPException(status_code=400, detail="No numeric columns found in the dataset.")
    
    try: 
        if len(df) == 0:
            raise HTTPException(status_code=400, detail="Dataset is empty")

        correlation_data = VizService().get_correlation_matrix(df) 
        return correlation_data
    
    except HTTPException:
        raise 
    except Exception as e: 
        raise HTTPException(status_code=500, detail=str(e))  
