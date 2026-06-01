"use client" 

import type { DataRow } from "@/src/lib/types"

type PreviewTableProps = {
    previewRows: DataRow[]; 
}; 

export default function PreviewTable({ previewRows }: PreviewTableProps) {
    const columns = previewRows.length > 0 ? Object.keys(previewRows[0]) : []; 

    if (previewRows.length === 0) {
        return <p>No preview rows available.</p>
    }

    return (
        <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead className="sticky top-0 bg-zinc-900/80 backdrop-blur">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col}
                                className="border border-gray-200 px-3 py-2 text-left bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {previewRows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={[
                                "border-t border-zinc-800",
                                rowIndex % 2 === 0 ? "bg-zinc-900/40" : "bg-zinc-900/20",
                                "hover:bg-zinc-900/60 transition",
                            ].join(" ")}
                        >
                            {columns.map((col) => {
                                const value = row[col]; 
                                return (
                                    <td
                                        key={`${rowIndex}-${col}`}
                                        className="border border-gray-200 px-3 py-2 dark:border-zinc-700"
                                    >
                                        {value === null || value === undefined ? "" : String(value)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}