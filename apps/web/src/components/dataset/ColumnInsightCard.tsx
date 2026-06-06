"use client";

import type { ColumnProfile, NumericStats, CategoricalStats } from "@/src/lib/types";

type ColumnInsightCardProps = {
  column: ColumnProfile;
  onClick?: () => void;
  selected?: boolean;
};

// Helper functions (keep these as they are)
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

function getKeyStat(col: ColumnProfile): string {
  const stats = col.stats;
  if (!stats) return "—";

  if (col.detected_type === "Numerical" && isNumericStats(stats)) {
    return stats.mean === null ? "mean: —" : `mean: ${stats.mean.toFixed(3)}`;
  }

  if (isCategoricalStats(stats)) {
    const top = stats.top_values?.[0];
    return !top ? "top: —" : `top: ${top.value} (${top.count})`;
  }

  return "—";
}

// Main component
export default function ColumnInsightCard({
  column,
  onClick,
  selected,
}: ColumnInsightCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-xl border bg-zinc-900/60 p-5 text-left transition",
        selected ? "border-green-500" : "border-zinc-800 hover:border-zinc-600",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-semibold">{column.name}</h3>
          <p className="mt-1 text-sm text-zinc-400">{column.dtype}</p>
        </div>
        <span className="shrink-0 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200">
          {column.detected_type}
        </span>
      </div>

      {/* Metadata Row */}
      <div className="mt-4 flex items-center gap-4 text-sm text-zinc-400">
        <span>Missing: {formatPercent(column.missing_percentage)}</span>
        <span>Unique: {column.unique_count}</span>
      </div>

      {/* Single Key Stat */}
      <div className="mt-4 text-sm">
        <p>{getKeyStat(column)}</p>
      </div>
    </button>
  );
}