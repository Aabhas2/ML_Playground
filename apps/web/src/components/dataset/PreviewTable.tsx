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
        <div className="mt-4 overflow-auto">
            <table className="min-w-full border-collapse border border-gray-200 dark:border-zinc-700">
                <thead>
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
                    {previewRows.map((row, rowIndex ) => (
                        <tr key={rowIndex}>
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