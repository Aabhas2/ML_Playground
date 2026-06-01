"use client"; 

import type { ColumnProfile, NumericStats, CategoricalStats } from "@/src/lib/types";

type ColumnInsightCardProps = {
    column: ColumnProfile; 
};

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

export default function ColumnInsightCard({ column }: ColumnInsightCardProps) {
    const stats = column.stats; 

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-600">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-lg font-semibold wrap-break-word">{column.name}</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                        {column.dtype}
                    </p>
                </div>
                <span className="shrink-0 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200">
                    {column.detected_type}
                </span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-zinc-400">
                <span>Missing: {formatPercent(column.missing_percentage)}</span>
                <span>Unique: {column.unique_count}</span>
            </div>

            {/* Numeric Stats */}
            {column.detected_type === "Numerical" && isNumericStats(stats) && (
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="text-zinc-400">Mean</div>
                    <div className="text-right">{stats.mean ?? "-"}</div>
                    <div className="text-zinc-400">Median</div> 
                    <div className="text-right">{stats.median ?? "-"}</div>
                    <div className="text-zinc-400">Min</div>
                    <div className="text-right">{stats.min ?? "-"}</div>
                    <div className="text-zinc-400">Max</div>
                    <div className="text-right">{stats.max ?? "-"}</div>
                    <div className="text-zinc-400">Std</div>
                    <div className="text-right">{stats.std ?? "-"}</div>
                </div>
            )}

            {/* Categorical/Text/Datetme/Boolean Stats */}
            {column.detected_type !== "Numerical" && isCategoricalStats(stats) && (
                <div className="mt-4">
                    <p className="text-sm text-zinc-400">Top values</p>
                    <ul className="mt-2 space-y-2 text-sm">
                        {stats.top_values?.map((tv,idx) => (
                            <li
                                key={`${column.name}-${idx}`}
                                className="flex items-center justify-between rounded-md bg-zinc-900/70 px-3 py-2"
                            >
                                <span>{tv.value}</span>
                                <span className="tabular-nums text-zinc-400">{tv.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}