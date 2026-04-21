export interface NumericStats {
    type: "numeric"; 
    mean: number; 
    min: number; 
    max: number; 
    median: number; 
    std: number; 
}

export interface CategoricalValue {
    value: string | number | boolean; 
    count: number; 
}

export interface CategoricalStats {
    type: "categorical"; 
    top_values: CategoricalValue[]; 
    unique_count: number; 
}

export interface DatasetUploadResponse {
    dataset_id: string; 
    filename: string; 
    status: string; 
}

export interface ColumnProfile {
    name: string; 
    dtype: string; 
    detected_type: "numeric" | "categorical" | "datetime" | "boolean"; 
    missing_count: number; 
    missing_percentage: number; 
    unique_count: number; 
    nullable: boolean; 
    stats?: NumericStats | CategoricalStats;
}

export type DataRow = Record<string, string | number | boolean | null>; 

export interface DatasetProfile {
    dataset_id: string; 
    row_count: number; 
    column_count: number; 
    columns: ColumnProfile[]; 
    preview_rows: DataRow[]; 
}