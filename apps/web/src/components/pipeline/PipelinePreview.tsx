"use client"; 

import PreviewTable from "../dataset/PreviewTable";
import type { DataRow } from "@/src/lib/types"; 

type PipelinePreviewProps = {
    rows: number | null; 
    columns: number | null; 
    previewRows: DataRow[]; 
    isLoading: boolean; 
    error: string | null; 
};

export default function PipelinePreview({
    rows, 
    columns, 
    previewRows, 
    isLoading, 
    error,
}: PipelinePreviewProps) {
    if (isLoading) {
        return <p className="text-sm text-zinc-400">Updating preview...</p>
    }

    if (error) {
        return <p className="text-sm text-rose-400">{error}</p>
    }

    if (rows === null || columns === null) {
        return <p className="text-sm text-zinc-400">Add an operation to see preview</p>; 
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-zinc-400">
                {rows} rows · {columns} columns
            </p>
            <PreviewTable previewRows={previewRows} /> 
        </div>
    );
}