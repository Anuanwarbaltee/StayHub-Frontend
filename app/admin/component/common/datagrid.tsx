"use client";
import React, { useEffect, useMemo, useState } from "react";
import { DataGridProps } from "../../types/datagrid";


const getValue = (obj: any, path: string) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);


export function DataGrid<T extends { _id?: string }>({
    columns,
    rows,
    loading = false,
    pageSizeOptions = [5, 10, 20],
    initialPageSize = 5,
    getRowId,
}: DataGridProps<T>) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" });

    // sort
    const sortedRows = useMemo(() => {
        if (!sortConfig.key) return rows;
        const key = sortConfig.key;
        const dir = sortConfig.direction === "asc" ? 1 : -1;
        return [...rows].sort((a, b) => {
            const aVal = getValue(a, key);
            const bVal = getValue(b, key);
            if (aVal == null) return -1 * dir;
            if (bVal == null) return 1 * dir;
            if (aVal < bVal) return -1 * dir;
            if (aVal > bVal) return 1 * dir;
            return 0;
        });
    }, [rows, sortConfig]);

    // pagination
    const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
    const paginatedRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedRows.slice(start, start + pageSize);
    }, [sortedRows, page, pageSize]);

    const handleSort = (key: string) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [totalPages, page]);

    return (
        <div className="border rounded-xl bg-white flex flex-col">
            {/* Scrollable Grid Area */}
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 sticky top-0 z-20">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.field}
                                    style={{ width: col.width }}
                                    className={`p-3 bg-gray-100 ${col.sortable ? "cursor-pointer select-none" : ""}`}
                                    onClick={() => col.sortable && handleSort(col.field)}
                                >
                                    {col.headerName}
                                    {sortConfig.key === col.field && (
                                        <span> {sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-6">Loading...</td>
                            </tr>
                        ) : paginatedRows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-6">No Data</td>
                            </tr>
                        ) : (
                            paginatedRows.map((row) => (
                                <tr
                                    key={getRowId ? getRowId(row) : (row as any)._id}
                                    className="border-t hover:bg-gray-50 h-10"
                                >
                                    {columns.map((col) => (
                                        <td key={col.field} className="p-3 align-middle">
                                            {col.render ? col.render(row) : String(getValue(row, col.field) ?? "-")}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer (Fixed) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 p-3 border-t">
                <div className="text-sm">Page {page} of {totalPages}</div>

                <div className="flex gap-2 items-center">
                    <button onClick={() => setPage((p) => Math.max(p - 1, 1))} className="px-3 py-1 border rounded">Prev</button>

                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border p-1 rounded"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>

                    <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} className="px-3 py-1 border rounded">Next</button>
                </div>
            </div>
        </div>
    );
}