"use client";  
import { DatasetSummaryProps } from "@/src/lib/types";

export default function DatasetSummary({
    datasetId, 
    rowCount, 
    columnCount,
} : DatasetSummaryProps) {
    return (
        <div className="mt-6 p-4 border-l-4 border-green-500 bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
            <h2 className="text-xl font-bold">Dataset Loaded</h2>
            <p>
                Dataset ID: <strong>{datasetId}</strong>
            </p>
            <p>
                Rows: <strong>{rowCount}</strong>
            </p>
            <p>
                Columns: <strong>{columnCount}</strong>
            </p>
        </div>
    );
}