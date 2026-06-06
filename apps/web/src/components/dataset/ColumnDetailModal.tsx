"use client" 

import type { ColumnProfile, NumericStats, CategoricalStats } from "@/src/lib/types"

type ColumnDetailMOdalProps = {
    column: ColumnProfile | null; 
    open: boolean; 
    onClose: () => void; 
}

function isNumericStats(stats: ColumnProfile["stats"]): stats is NumericStats {
    return !!stats && typeof stats === "object" && "mean" in stats; 
}

function isCategoricalStats(stats: ColumnProfile["stats"]): stats is CategoricalStats {
    return !!stats && typeof stats === "object" && "top_values" in stats; 
}

function formatPercent(fraction: number): string {
    const pct = Math.max(0, Math.min(1, fraction)) * 100; 
    return `${pct.toFixed(1)}%`; 
}

export default function ColumnDetailModal ({
    column,
    open,
    onClose, 
}: ColumnDetailMOdalProps) {
    if (!open || !column) return null; 

    const stats = column.stats; 

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" 
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="wrap-break-word text-2xl font-semibold">{column.name}</h2>
                        <p className="mt-1 text-sm text-zinc-400">{column.dtype}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
                    >
                        Close 
                    </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xlk border border-zinc-800 bg-zinc-900/60 p-4">
                        <p className="text-sm text-zinc-400">Missing</p> 
                        <p className="mt-1 text-lg font-medium">
                            {formatPercent(column.missing_percentage)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                        <p className="text-sm text-zinc-400">Unique</p>
                        <p className="mt-1 text-lg font-medium">{column.unique_count}</p>
                    </div>
                </div>

                {column.detected_type === "Numerical" && isNumericStats(stats) && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">Numeric Stats</h3> 
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <StatRow label="Mean" value={stats.mean} /> 
                            <StatRow label="Median" value={stats.median} /> 
                            <StatRow label="Min" value={stats.min} /> 
                            <StatRow label="Max" value={stats.max} /> 
                            <StatRow label="Std" value={stats.std} /> 
                        </div>
                    </div>
                )}

                {column.detected_type !== "Numerical" && isCategoricalStats(stats) && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">Top Values</h3> 
                        <div className="mt-3 space-y-2">
                            {stats.top_values.length === 0 ? (
                                <p className="text-sm text-zinc-400">No top values availalbe</p>
                            ) : (
                                stats.top_values.map((item, index) => (
                                    <div
                                        key={`${column.name}-${index}`}
                                        className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3"
                                    >
                                        <span className="truncate pr-4">{item.value}</span>
                                        <span className="tabular-nums text-zinc-400">{item.count}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

function StatRow ({
    label, 
    value, 
}: {
    label: string; 
    value: number | null; 
}) {
    return (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="mt-1 text-base font-medium">{value ?? "-"}</p>
        </div>
    )
}