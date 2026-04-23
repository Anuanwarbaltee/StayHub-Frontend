"use client";

import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

export default function RemoteLocationPicker({ onSelect }: { onSelect: (data: any) => void }) {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const searchAddress = async () => {
        if (address.length < 3) return;
        setLoading(true);
        try {
            // Nominatim is free and requires no API key
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=5`
            );
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Geocoding error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Property Address</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search: e.g. 123 Hotel St, Paris"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                    />
                    <button
                        type="button"
                        onClick={searchAddress}
                        className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                    </button>
                </div>

                {/* Search Results Dropdown */}
                {results.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                        {results.map((item) => (
                            <button
                                key={item.place_id}
                                type="button"
                                onClick={() => {
                                    onSelect(item);
                                    setResults([]);
                                    setAddress(item.display_name);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-b border-slate-50 last:border-none flex items-start gap-3"
                            >
                                <MapPin className="text-slate-400 mt-1 shrink-0" size={14} />
                                <span>{item.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}