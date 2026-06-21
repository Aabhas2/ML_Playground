"use client";

import { useEffect, useState } from "react";
import { trainModel } from "../../lib/api";
import { ColumnProfile } from "../../lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ModelTrainingTabProps {
    datasetId: string;
    columns: ColumnProfile[];
}

export default function ModelTrainingTab({ datasetId, columns }: ModelTrainingTabProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [targetCol, setTargetCol] = useState(columns[0]?.name || "");
    const [taskType, setTaskType] = useState<"regression" | "classification">("regression");
    const [algorithm, setAlgorithm] = useState("random_forest");
    const [split, setSplit] = useState(0.8);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any | null>(null);

    // SSR mounting check
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Set default algorithm whenever task type changes
    useEffect(() => {
        if (taskType === "regression") {
            setAlgorithm("random_forest");
        } else {
            setAlgorithm("random_forest");
        }
    }, [taskType]);

    const handleTrain = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults(null);
        try {
            const data = await trainModel(datasetId, targetCol, taskType, algorithm, split);
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to train machine learning model");
        } finally {
            setLoading(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-8">
            <div className="border-b border-zinc-850 pb-5">
                <h3 className="text-xl font-bold text-zinc-100">Model Builder</h3>
                <p className="text-xs text-zinc-400">Configure parameters to train and evaluate ML algorithms in real time</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Configuration Left Panel (Span 2) */}
                <form onSubmit={handleTrain} className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
                    <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wide">Training Parameters</h4>

                    <div className="space-y-1">
                        <label className="text-xs text-zinc-450 font-semibold uppercase">Target Column (y)</label>
                        <select
                            value={targetCol}
                            onChange={(e) => setTargetCol(e.target.value)}
                            className="w-full rounded-lg border border-zinc-750 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                        >
                            {columns.map((c) => (
                                <option key={c.name} value={c.name}>
                                    {c.name} ({c.dtype})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-zinc-450 uppercase font-medium">Task Type</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setTaskType("regression")}
                                className={`flex-1 rounded-lg py-2 border text-xs font-semibold transition ${taskType === "regression" ? "bg-emerald-950/40 text-emerald-400 border-emerald-800" : "bg-zinc-950/40 border-zinc-800 text-zinc-400"
                                    }`}
                            >
                                Regression
                            </button>
                            <button
                                type="button"
                                onClick={() => setTaskType("classification")}
                                className={`flex-1 rounded-lg py-2 border text-xs font-semibold transition ${taskType === "classification" ? "bg-emerald-950/40 text-emerald-400 border-emerald-800" : "bg-zinc-950/40 border-zinc-800 text-zinc-400"
                                    }`}
                            >
                                Classification
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-zinc-450 font-semibold uppercase">Algorithm Model</label>
                        <select
                            value={algorithm}
                            onChange={(e) => setAlgorithm(e.target.value)}
                            className="w-full rounded-lg border border-zinc-750 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                        >
                            {taskType === "regression" ? (
                                <>
                                    <option value="random_forest">Random Forest Regressor</option>
                                    <option value="gradient_boosting">Gradient Boosting Regressor</option>
                                    <option value="linear_regression">Linear Regression</option>
                                </>
                            ) : (
                                <>
                                    <option value="random_forest">Random Forest Classifier</option>
                                    <option value="gradient_boosting">Gradient Boosting Classifier</option>
                                    <option value="logistic_regression">Logistic Regression</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-zinc-450 font-semibold uppercase">
                            <span>Train Split</span>
                            <span className="font-mono text-emerald-400">{(split * 100).toFixed(0)}% / {((1 - split) * 100).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="0.9"
                            step="0.05"
                            value={split}
                            onChange={(e) => setSplit(parseFloat(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer h-1.5 rounded bg-zinc-850"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? "Training Model..." : "Train Model →"}
                    </button>
                </form>

                {/* Dashboard Results Panel (Span 3) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Error Box */}
                    {error && (
                        <div className="rounded-xl border border-rose-900 bg-rose-950/20 p-4 text-rose-400 text-sm">
                            ❌ {error}
                        </div>
                    )}

                    {/* Empty State */}
                    {!results && !loading && (
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 h-full flex flex-col justify-center items-center text-center space-y-2">
                            <span className="text-3xl text-zinc-700">🤖</span>
                            <p className="text-zinc-400 font-semibold">Model training playground ready</p>
                            <p className="text-xs text-zinc-600 max-w-xs">Select your parameters and click "Train Model" to see validation evaluation and weights.</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 h-full flex flex-col justify-center items-center text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 border-r-2 mb-4"></div>
                            <p className="text-sm text-zinc-400">Training {algorithm.replace("_", " ")}...</p>
                        </div>
                    )}

                    {/* Results Content Dashboard */}
                    {results && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Score Metrics Row */}
                            <div className="grid grid-cols-3 gap-4">
                                {taskType === "regression" ? (
                                    <>
                                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                                            <span className="block text-[10px] text-zinc-500 font-semibold uppercase">R-Squared (R²)</span>
                                            <span className="block mt-1.5 text-xl font-bold font-mono text-emerald-400">{results.metrics.r2.toFixed(4)}</span>
                                        </div>
                                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                                            <span className="block text-[10px] text-zinc-500 font-semibold uppercase">RMSE (Root MSE)</span>
                                            <span className="block mt-1.5 text-xl font-bold font-mono text-zinc-200">{results.metrics.rmse.toFixed(4)}</span>
                                        </div>
                                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                                            <span className="block text-[10px] text-zinc-500 font-semibold uppercase">Mean Absolute Error</span>
                                            <span className="block mt-1.5 text-xl font-bold font-mono text-zinc-200">{results.metrics.mae.toFixed(4)}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                                            <span className="block text-[10px] text-zinc-500 font-semibold uppercase">Accuracy Score</span>
                                            <span className="block mt-1.5 text-xl font-bold font-mono text-emerald-400">{(results.metrics.accuracy * 100).toFixed(2)}%</span>
                                        </div>
                                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                                            <span className="block text-[10px] text-zinc-500 font-semibold uppercase">Macro F1-Score</span>
                                            <span className="block mt-1.5 text-xl font-bold font-mono text-zinc-200">{(results.metrics.f1 * 100).toFixed(2)}%</span>
                                        </div>
                                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                                            <span className="block text-[10px] text-zinc-500 font-semibold uppercase">Macro Precision</span>
                                            <span className="block mt-1.5 text-xl font-bold font-mono text-zinc-200">{(results.metrics.precision * 100).toFixed(2)}%</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Two-Column Chart Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                {/* Feature Importance Chart (Span 3 - 60%) */}
                                <div className="md:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
                                    <div>
                                        <h5 className="text-sm font-semibold text-zinc-200">Relative Feature Importance</h5>
                                        <p className="text-[10px] text-zinc-500">Weight coefficients normalized between 0 and 1</p>
                                    </div>
                                    <div className="h-[280px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={results.feature_importances} layout="vertical" margin={{ left: -10, right: 10 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" horizontal={false} />
                                                <XAxis type="number" stroke="#52525b" fontSize={9} />
                                                <YAxis dataKey="feature" type="category" stroke="#52525b" fontSize={9} width={80} />
                                                <Tooltip
                                                    cursor={{ fill: "#27272a", opacity: 0.15 }}
                                                    contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "8px" }}
                                                    labelStyle={{ display: "none" }}
                                                    itemStyle={{ color: "#34d399", fontSize: "11px", fontFamily: "monospace" }}
                                                    formatter={(val: any) => [`${(Number(val) * 100).toFixed(2)}%`, "Weight"]}
                                                />

                                                <Bar dataKey="importance" fill="#10b981" radius={[0, 3, 3, 0]} opacity={0.8} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Confusion Matrix (Span 2 - 40% - Classification only) */}
                                {taskType === "classification" ? (
                                    <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
                                        <div>
                                            <h5 className="text-sm  text-zinc-200 font-medium">Confusion Matrix</h5>
                                            <p className="text-[10px] text-zinc-500">Rows are True categories, Cols are Predicted</p>
                                        </div>

                                        <div className="flex flex-col items-center justify-center h-[260px] w-full">
                                            <div
                                                className="grid gap-1 font-mono text-[10px] text-center font-bold"
                                                style={{
                                                    gridTemplateColumns: `repeat(${results.metrics.confusion_matrix.length}, minmax(0, 1fr))`,
                                                    width: "100%",
                                                    maxWidth: "180px",
                                                }}
                                            >
                                                {results.metrics.confusion_matrix.flatMap((row: number[], rIdx: number) =>
                                                    row.map((val: number, cIdx: number) => {
                                                        const isDiagonal = rIdx === cIdx;
                                                        return (
                                                            <div
                                                                key={`${rIdx}-${cIdx}`}
                                                                className={`aspect-square flex items-center justify-center rounded border transition text-sm ${isDiagonal
                                                                    ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-400"
                                                                    : "bg-rose-950/25 border-rose-900/35 text-rose-400"
                                                                    }`}
                                                                title={`True: ${results.metrics.classes[rIdx]}, Pred: ${results.metrics.classes[cIdx]}`}
                                                            >
                                                                {val}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>

                                            {/* Legend */}
                                            <div className="flex gap-4 mt-4 text-[10px] text-zinc-500 font-semibold font-mono">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-2 w-2 rounded bg-emerald-950 border border-emerald-800"></div>
                                                    <span>True Pos/Neg</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-2 w-2 rounded bg-rose-950/30 border border-rose-900/40"></div>
                                                    <span>Errors</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Model Details (Span 2 - 40% - Regression fallback) */
                                    <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
                                        <h5 className="text-sm font-semibold text-zinc-200">Execution Info</h5>
                                        <div className="space-y-3 text-xs font-mono">
                                            <div className="border-b border-zinc-850 pb-1.5">
                                                <span className="block text-[10px] text-zinc-500">Features Trained</span>
                                                <span className="text-zinc-300 font-semibold">{results.features_used.length} columns</span>
                                            </div>
                                            <div className="border-b border-zinc-850 pb-1.5">
                                                <span className="block text-[10px] text-zinc-500">Validation Split</span>
                                                <span className="text-zinc-300 font-semibold">{((1 - split) * 100).toFixed(0)}% test set</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-zinc-500">Target</span>
                                                <span className="text-emerald-400 font-semibold truncate block">{results.target_column}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
