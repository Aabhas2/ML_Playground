"use client"; 

type DatasetSummaryProps = {
    datasetId: string; 
    rowCount: number; 
    columnCount: number; 
}; 

function MetricCard ({
    label,
    value,
    hint,
}: {
    label: string; 
    value: string; 
    hint?: string; 
}) {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-600">
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
            {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
        </div>
    );
}

export default function DatasetSummary ({
    datasetId, 
    rowCount, 
    columnCount, 
}: DatasetSummaryProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricCard label="Rows" value={rowCount.toString()} /> 
            <MetricCard label="Columns" value={columnCount.toString()} /> 
            <MetricCard label="Dataset ID" value={datasetId} hint="Unique identifier" /> 
        </div>
    );
}

