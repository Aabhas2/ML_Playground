"use client";
import { useState } from "react";
import type { ColumnProfile, PipelineOperation } from "@/src/lib/types";


type OperationType =
    | "drop_columns"
    | "fill_missing"
    | "remove_duplicates"
    | "convert_type";

type OperationPanelProps = {
    columns: ColumnProfile[];
    onAddOperation: (operation: PipelineOperation) => Promise<void>;
    isSubmitting: boolean;
};

export default function OperationPanel({
    columns,
    onAddOperation,
    isSubmitting,
}: OperationPanelProps) {
    const [operationType, setOperationType] = useState<OperationType>("drop_columns");
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [fillColumn, setFillColumn] = useState("");
    const [fillStrategy, setFillStrategy] = useState("mean");
    const [fillValue, setFillValue] = useState("");
    const [convertColumn, setConvertColumn] = useState("");
    const [targetType, setTargetType] = useState("int");
    const [error, setError] = useState<string | null>(null);

    function toggleColumn(columnName: string) {
        setSelectedColumns((prev) =>
            prev.includes(columnName)
                ? prev.filter((c) => c !== columnName)
                : [...prev, columnName]
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        let operation: PipelineOperation;

        try {
            if (operationType === "drop_columns") {
                if (selectedColumns.length === 0) {
                    setError("Select at least one column to drop.");
                    return;
                }
                operation = { type: "drop_columns", params: { columns: selectedColumns } };
            } else if (operationType === "fill_missing") {
                if (!fillColumn) {
                    setError("Select a column for fill missing.");
                    return;
                }
                operation = {
                    type: "fill_missing",
                    params: {
                        column: fillColumn,
                        strategy: fillStrategy,
                        ...(fillStrategy === "constant" ? { value: fillValue } : {}),
                    },
                };
            } else if (operationType === "remove_duplicates") {
                operation = { type: "remove_duplicates", params: {} };
            } else {
                if (!convertColumn) {
                    setError("Select a column to convert.")
                    return;
                }
                operation = {
                    type: "convert_type",
                    params: { column: convertColumn, target_type: targetType },
                };
            }

            await onAddOperation(operation);

            setSelectedColumns([]);
            setFillColumn("");
            setFillValue("");
            setConvertColumn("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add operation.");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-2 block text-sm text-zinc-400">Operation</label>
                <select
                    value={operationType}
                    onChange={(e) => setOperationType(e.target.value as OperationType)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-zinc-500"
                >
                    <option value="drop_columns">Drop Columns</option>
                    <option value="fill_missing">Fill Missing</option>
                    <option value="remove_duplicates">Remove Duplicates</option>
                    <option value="convert_type">Convert Type</option>
                </select>
            </div>

            {operationType === "drop_columns" && (
                <div className="max-h-48 space-y-2 overflow-auto rounded-lg border border-zinc-800 p-3">
                    {columns.map((col) => (
                        <label key={col.name} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={selectedColumns.includes(col.name)}
                                onChange={() => toggleColumn(col.name)}
                            />
                            {col.name}
                        </label>
                    ))}
                </div>
            )}

            {operationType === "fill_missing" && (
                <div className="space-y-3">
                    <select
                        value={fillColumn}
                        onChange={(e) => setFillColumn(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100"
                    >
                        <option value="">Select column</option>
                        {columns.map((col) => (
                            <option value={col.name} key={col.name}>{col.name}</option>
                        ))}
                    </select>

                    <select
                        value={fillStrategy}
                        onChange={(e) => setFillStrategy(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100"
                    >
                        <option value="mean">Mean</option>
                        <option value="median">Median</option>
                        <option value="mode">Mode</option>
                        <option value="constant">Constant</option>
                    </select>

                    {fillStrategy === "constant" && (
                        <input
                            type="text"
                            value={fillValue}
                            onChange={(e) => setFillColumn(e.target.value)}
                            placeholder="Constant value"
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100"
                        />
                    )}
                </div>
            )}

            {operationType === "convert_type" && (
                <div className="space-y-3">
                    <select
                        value={convertColumn}
                        onChange={(e) => setConvertColumn(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100"
                    >
                        <option value="">Select column</option>
                        {columns.map((col) => (
                            <option key={col.name} value={col.name}>
                                {col.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={targetType}
                        onChange={(e) => setTargetType(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100"
                    >
                        <option value="int">Integer</option>
                        <option value="float">Float</option>
                        <option value="string">String</option>
                        <option value="category">Category</option>
                    </select>
                </div>
            )}

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:opacity-50"
            >
                {isSubmitting ? "Adding..." : "Add Operation"}
            </button>
        </form>
    );
}


