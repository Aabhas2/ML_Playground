import pandas as pd 
from pathlib import Path 
from pandas.errors import EmptyDataError, ParserError
from pandas.api.types import is_numeric_dtype, is_categorical_dtype

# Helper functions 
def load_data(file_path: str) -> tuple[pd.DataFrame, str]: 
    path = Path(file_path)
    ext = path.suffix.lower()
    if ext not in {".csv", ".xlsx"}: 
        raise ValueError(f"Unsupported file type: {ext!r}. Only '.csv' and '.xlsx' are supported.")
    
    try:
        if ext == '.xlsx': 
            df = pd.read_excel(path) 
        else: 
            df = pd.read_csv(path) 
    except (FileNotFoundError, PermissionError): 
        raise 
    except (ParserError, EmptyDataError, UnicodeDecodeError, ValueError) as e: 
        raise ValueError(f"Failed to parse file: {path}: ({ext})") from e
    
    return df, ext.lstrip(".")

# Column type detection function 
def detect_column_type(series: pd.Series) -> str:  
    s = series.dropna() 
    if is_numeric_dtype(s): 
        return "Numerical"
    elif pd.api.types.is_datetime64_any_dtype(series):
        return "Datetime" 
    else: 
        return "Categorical"
    

def profile_dataset(file_path: str) -> dict: 
    # load the data 
    df, file_type = load_data(file_path) 

    # data profile (about the dataset / dataset info) 
    row_count = len(df) 
    column_count = len(df.columns) 

    df = df.where(pd.notnull(df), None) 

    columns = [] 
    for col in df.columns: 
        series = df[col]
        # missing values 
        missing_count = series.isnull().sum() 
        missing_percentage = missing_count / len(series) if len(series) > 0 else 0

        # Stats 
        col_type = detect_column_type(series) 

        if col_type == "Numerical": 
            stats = {
                "mean": series.mean(), 
                "min": float(series.mean()) if series.mean() is not None else None, 
                "max": series.max(), 
                "median": series.median(), 
                "std": series.std()
            }

        elif col_type == "Categorical": 
            value_counts = series.value_counts().head(5)

            top_values = [
                {"value": str(idx), "count": int(val)}
                for idx, val in value_counts.items()
            ]
            stats = {
                "top_values": top_values,
                "unique_count": series.nunique() 

            }

        # Column object 
        columns.append({
            "name": col, 
            "detected_type": col_type, 
            "missing_count": int(missing_count),
            "missing_percentage": float(missing_percentage),
            "stats": stats
        })

    preview = df.head(10).to_dict(orient="records")

    return {
        "row_count": row_count, 
        "column_count": column_count, 
        "columns": columns, 
        "preview_rows": preview 
    }