"use client";
import { HotelListItem } from "@/app/types/hotel";
import React, { useEffect, useMemo, useState } from "react";
import { Column } from "../../types/datagrid";
import { DataGrid } from "../../component/common/datagrid";
import { apiFetch } from "@/app/lib/api";
import { useDispatch } from "react-redux";
import { showAlert } from "@/app/redux/reducers/alertSlice";
import GlobalAlert from "@/app/components/ui/alert";

export default function HotelList() {
    const [hotels, setHotels] = useState<HotelListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({ name: "", city: "" });
    const dispatch = useDispatch();


    const fetchHotels = async () => {
        try {
            setLoading(true);
            const res = await apiFetch("hotel/gethotel", {
                method: "GET",
            });
            if (res.success) {
                setHotels(res.data)
            } else {
                dispatch(showAlert({
                    type: "error",
                    message: res.message || "Something went wrong."
                }))
                setHotels([])
            };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const filteredHotels = useMemo(() => {
        return hotels.filter((h) =>
            h.name.toLowerCase().includes(filters.name.toLowerCase()) &&
            h.location.city.toLowerCase().includes(filters.city.toLowerCase())
        );
        // return hotels.filter((h) =>
        //   h.name.toLowerCase().includes(debouncedFilters.name.toLowerCase()) &&
        //   h.location.city.toLowerCase().includes(debouncedFilters.city.toLowerCase())
        // );
    }, [hotels]);

    const columns: Column<HotelListItem>[] = [
        { field: "name", headerName: "Hotel Name", width: "250px", sortable: true },
        { field: "location.city", headerName: "City", width: "150px", sortable: true },
        {
            field: "isActive",
            headerName: "Status",
            width: "120px",
            render: (row) => (
                <span className={row.isActive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {row.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
        // { field: "averageRating", headerName: "Average Rating", sortable: true },
        { field: "description", headerName: "Description", width: "200px", sortable: true },
        // { field: "location.country", headerName: "Country", sortable: true },
        { field: "createdAt", headerName: "Created Date", width: "200px", sortable: false },

    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Hotel List</h1>
                <button onClick={() => setShowFilter((s) => !s)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    {showFilter ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            {showFilter && (
                <div className="flex gap-4 mb-4 p-4 border rounded-lg">
                    <input
                        placeholder="Hotel Name"
                        value={filters.name}
                        onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                        className="border p-2 rounded w-full"
                    />
                    <input
                        placeholder="City"
                        value={filters.city}
                        onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                        className="border p-2 rounded w-full"
                    />
                    <button onClick={() => setFilters({ name: "", city: "" })} className="border px-4 rounded">Reset</button>
                </div>
            )}

            <DataGrid<HotelListItem>
                columns={columns}
                rows={filteredHotels}
                loading={loading}
                getRowId={(r) => r._id}
            />
            <GlobalAlert />
        </div>
    );
}