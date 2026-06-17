import numpy as np 
import pandas as pd 
from typing import Dict, List, Any, Tuple 

class VizService: 
    def get_histogram_data(self, df: pd.DataFrame, column: str, bins: int = 10) -> List[Dict[str,Any]]: 
        """Groups continous numerical data into bins and counts frequencies"""
        if column not in df.columns: 
            raise ValueError(f"Column '{column}' does not exist.")

        series = df[column].dropna() 
        if not pd.api.types.is_numeric_dtype(series): 
            raise ValueError(f"Histogram only works on numerical columns. '{column}' is not numerical.")

        if series.empty: 
            return [] 

        counts, bin_edges = np.histogram(series, bins=bins) 

        result = [] 
        for i in range(len(counts)): 
            result.append({
                "bin_start": float(bin_edges[i]), 
                "bin_end": float(bin_edges[i+1]), 
                "bin_label": f"{bin_edges[i]:.2f} - {bin_edges[i+1]:.2f}", 
                "count": int(counts[i]) 
            })

        return result 

    def get_boxplot_data(self, df: pd.DataFrame, column: str) -> Dict[str, Any]: 
        """Calculates five-number summary and finds outlier points."""

        if column not in df.columns: 
            raise ValueError(f"Column '{column}' does not exist.") 

        series = df[column].dropna()  
        if not pd.api.types.is_numeric_dtype(series): 
            raise ValueError(f"Boxplot only works on numerical columns. '{column}' is not numerical.") 
        
        if series.empty: 
            return {"min": 0, "q1": 0, "median": 0, "q3": 0, "max": 0, "outliers": []}

        q1 = float(series.quantile(0.25)) 
        q2 = float(series.quantile(0.50)) 
        q3 = float(series.quantile(0.75)) 

        iqr = q3 - q1 
        lower_fence = q1 - 1.5 * iqr 
        upper_fence = q3 + 1.5 * iqr

        outliers = series[(series < lower_fence) | (series > upper_fence)].tolist() 

        non_outliers = series[(series >= lower_fence) & (series <= upper_fence)]
        min_val = float(non_outliers.min()) if not non_outliers.empty else q1 
        max_val = float(non_outliers.max()) if not non_outliers.empty else q3 

        return {
            "min": min_val, 
            "q1": q1, 
            "median": q2, 
            "q3": q3, 
            "max": max_val, 
            "outliers": [float(x) for x in outliers]
        }

    def get_scatterplot_data(self, df: pd.DataFrame, col_x: str, col_y: str, sample_limit: int = 1000) -> List[Dict[str, Any]]: 
        """Returns pairs of x, y coordinates, down-sampling if the dataset is large."""

        if col_x not in df.columns or col_y not in df.columns: 
            raise ValueError(f"Column '{col_x}' or '{col_y}' does not exist.")

        temp_df = df[[col_x, col_y]].dropna() 
        if not pd.api.types.is_numeric_dtype(temp_df[col_x]) or not pd.api.types.is_numeric_dtype(temp_df[col_y]): 
            raise ValueError("Scatterplot required both X and Y columns to be numerical.") 

        if len(temp_df) > sample_limit: 
            temp_df = temp_df.sample(n=sample_limit, random_state=42) 

        return [{"x": float(row[col_x]), "y": float(row[col_y])} for _, row in temp_df.iterrows()] 

    def get_correlation_matrix(self, df: pd.DataFrame) -> Dict[str, Any]: 
        """Calculates the Pearson correlation matrix for all numerical columns."""
        num_cols = [col for col in df.columns if pd.api.types.is_numeric_dtype(df[col])] 

        if len(num_cols) < 2: 
            return{"columns": [], "matrix": []} 

        corr_df = df[num_cols].corr().fillna(0) 

        return {
            "columns": num_cols, 
            "matrix": corr_df.values.tolist() 
        }