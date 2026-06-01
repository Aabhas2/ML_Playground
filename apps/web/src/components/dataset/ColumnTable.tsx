"use client"

import type { ColumnProfile, NumericStats, CategoricalStats } from "@/src/lib/types"

type ColumnTableProps = {
    columns: ColumnProfile[]; 
}; 

function formatPercent(fraction: number): string {
    const pct = Math.max(0, Math.min(1, fraction)) * 100; 
    return `${pct.toFixed(1)}%`; 
}

function getTypeBadgeClasses(detectedType: ColumnProfile["detected_type"]): string {
    // Tailwind only, theme 
    switch(detectedType) {
        case "Numerical": 
            return "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100"; 
        case "Categorical": 
        case "Text": 
            return "bg-purple-100 text-purple-900 dark:bg-purple-900/40 dark:text-purple-100";
        case "Datetime": 
            return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100";
        case "Boolean": 
            return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100";
        default: 
            return "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"; 
    }
}

function isNumericStats(stats: ColumnProfile["stats"]): stats is NumericStats {
    return !!stats && typeof stats === "object" && "mean" in stats; 
}

function isCategoricalStats(stats: ColumnProfile["stats"]): stats is CategoricalStats {
    return !!stats && typeof stats === "object" && "top_values" in stats; 
}

function getMissingBarClass(pct: number): string {
    if (pct < 0.05) return "bg-emerald-500";  
    if (pct < 0.2) return "bg-amber-500"; 
    return "bg-rose-500"; 
}

function getKeyStat(col: ColumnProfile): string {
    const stats = col.stats; 

    if (!stats) return "-"; 

    if (col.detected_type === "Numerical" && isNumericStats(stats)) {
        const mean = stats.mean; 
        return mean === null ? "mean: -" : `mean: ${mean.toFixed(3)}`;
    }

    // For categorical/text/datetime/boolean we show "top" 
    if (isCategoricalStats(stats)) {
        const top = stats.top_values?.[0]; 
        if (!top) return "top: -"; 
        return `top: ${top.value} (${top.count})`;
    }

    return "-";  
}

export default function ColumnTable({ columns }: ColumnTableProps) {
    if (columns.length === 0) {
        return <p className="mt-4">No column profile available.</p>; 
    }

    return (
        <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead className="sticky top-0 bg-zinc-900/80 backdrop-blur">
                    <tr>
                        <th className="px-4 py-3 text-left text-zinc-300">
                            Column
                        </th>
                        <th className="px-4 py-3 text-left text-zinc-300">
                            Type
                        </th>
                        <th className="px-4 py-3 text-left text-zinc-300">
                            Missing %
                        </th>
                        <th className="px-4 py-3 text-left text-zinc-300">
                            Unique
                        </th>
                        <th className="px-4 py-3 text-left text-zinc-300">
                            Key Stat
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {columns.map((col, idx) => {
                        const missingPct = Math.max(0,Math.min(1,col.missing_percentage));
                        const missingPctLabel = formatPercent(missingPct);
                        
                        return (
                            <tr 
                                key={col.name}
                                className={[
                                    "border-t border-zinc-800", 
                                    idx % 2 === 0 ? "bg-zinc-900/40" : "bg-zinc-900/20", 
                                    "hover:bg-zinc-900/60 transition", 
                                ].join(" ")}
                            
                            >
                                <td className="px-4 py-3">
                                    {col.name}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={[
                                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", 
                                            getTypeBadgeClasses(col.detected_type), 
                                        ].join(" ")}
                                    >
                                        {col.detected_type}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-32 rounded bg-zinc-800">
                                            <div
                                                className={`h-2 rounded ${getMissingBarClass(missingPct)}`}
                                                style={{ width: `${missingPct * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-zinc-400 tabular-nums">{missingPctLabel}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 tabular-nums">
                                    {col.unique_count}
                                </td>
                                <td className="px-4 py-3">
                                    {getKeyStat(col)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}
