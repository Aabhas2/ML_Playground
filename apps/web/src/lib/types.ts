export interface NumericStats {
    mean: number | null;
    min: number | null;
    max: number | null;
    median: number | null;
    std: number | null;
}

export interface TopValue {
    value: string;
    count: number;
}

export interface CategoricalValue {
    top_values: TopValue[],
    unique_count: number,
}

export interface CategoricalStats {
    top_values: TopValue[];
    unique_count: number;
}

export interface DatasetUploadResponse {
    dataset_id: string;
    filename: string;
    status: string;
}

export type DetectedType = "Numerical" | "Categorical" | "Datetime" | "Text" | "Boolean";

export interface ColumnProfile {
    name: string;
    dtype: string;
    detected_type: DetectedType;
    missing_count: number;
    missing_percentage: number;
    unique_count: number;
    nullable: boolean;
    stats?: NumericStats | CategoricalStats
}

export type DatasetSummaryProps = {
    datasetId: string;
    rowCount: number;
    columnCount: number;
};

export type DataRow = Record<string, string | number | boolean | null>;

export interface DatasetProfile {
    dataset_id: string;
    filename: string;
    row_count: number;
    column_count: number;
    columns: ColumnProfile[];
    preview_rows: DataRow[];
}

export interface PipelineOperation {
    type: string;
    params: Record<string, unknown>;
}

export interface PipelineResponse {
    pipeline_id: string;
    name: string | null;
    dataset_id: string;
    operations: PipelineOperation[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface PipelinePreviewResponse {
    rows: number;
    columns: number;
    preview: DataRow[];
}

export interface PipelineCreateResponse {
    pipeline_id: string;
}