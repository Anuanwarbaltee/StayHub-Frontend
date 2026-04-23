"use client"
import { useState, useRef, useEffect } from "react";
import { Search, Plus, Minus, Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { isPastDate } from "../utils/utils";
import { useAppDispatch, useAppSelector } from '../redux/hook/hooks';
import { updateFilters } from "../redux/reducers/filterSlice";

export default function Hero({ isDetailPage }: { isDetailPage?: boolean }) {
    const [active, setActive] = useState<string | null>(null);

    const [location, setLocation] = useState("");
    const [guests, setGuests] = useState(1);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const filterValues = useAppSelector((state) => state.bookingFilters)

    // ✅ Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setActive(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (filterValues) {
            setLocation(filterValues.location);
            setGuests(filterValues.capacity);
            setStartDate(filterValues.startDate ? new Date(filterValues.startDate) : null);
            setEndDate(filterValues.endDate ? new Date(filterValues.endDate) : null);
        }

    }, [])

    // ✅ Date click logic
    const handleDateClick = (date: Date) => {
        if (isPastDate(date)) return;
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else {
            if (date < startDate) {
                setStartDate(date);
            } else {
                setEndDate(date);
                setActive(null);
            }
        }
    };

    const isInRange = (date: Date) => {
        if (!startDate || !endDate) return false;
        return date > startDate && date < endDate;
    };

    const handleSubmit = () => {
        dispatch(updateFilters(
            {
                startDate: startDate ? startDate.toISOString() : "",
                endDate: endDate ? endDate.toISOString() : "",
                capacity: guests,
                location,
            })
        )
        console.log({
            location,
            guests,
            startDate,
            endDate
        });
    };

    return (
        <section className="w-full px-4 py-8  flex justify-center mt-4">
            <div className="w-full max-w-5xl">

                {/* --- LARGE SCREEN SEARCH BAR (Desktop) --- */}
                <div className="hidden md:flex bg-white rounded-lg shadow-sm border border-gray-200 items-center p-2 gap-2">
                    {!isDetailPage && (
                        <>
                            <div
                                onClick={() => setActive("location")}
                                className={`flex-[1.5] flex items-center gap-3 px-4 py-3 cursor-pointer rounded-md hover:bg-gray-50 transition ${active === "location" ? "bg-gray-100" : ""}`}
                            >
                                <Search size={18} className="text-gray-400" />
                                <p className="text-sm text-gray-400 font-medium truncate">
                                    {location || "Where to next?"}
                                </p>
                            </div>
                            <div className="w-px h-8 bg-gray-200" />
                        </>
                    )}

                    <div
                        onClick={() => setActive("checkin")}
                        className={`flex-1 flex items-center gap-3 px-4 py-3 cursor-pointer rounded-md hover:bg-gray-50 transition ${active === "checkin" || active === "checkout" ? "bg-gray-100" : ""}`}
                    >
                        <Calendar size={18} className="text-gray-400" />
                        <p className="text-sm text-gray-400 font-medium truncate">
                            {startDate ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate ? endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Oct 31'}` : "Oct 24 — Oct 31"}
                        </p>
                    </div>

                    <div className="w-px h-8 bg-gray-200" />

                    <div
                        onClick={() => setActive("guests")}
                        className={`flex-1 flex items-center gap-3 px-4 py-3 cursor-pointer rounded-md hover:bg-gray-50 transition ${active === "guests" ? "bg-gray-100" : ""}`}
                    >
                        <Users size={18} className="text-gray-400" />
                        <p className="text-sm text-gray-400 font-medium truncate">
                            {guests} Guest{guests > 1 && "s"}
                        </p>
                    </div>

                    <button onClick={handleSubmit} className="bg-black hover:bg-gray-800 text-white px-8 py-2.5 rounded-md transition font-medium text-sm ml-auto">
                        Search
                    </button>
                </div>

                {/* --- MOBILE SCREEN SEARCH BAR (Matches Screenshot) --- */}
                <div className="flex md:hidden flex-col bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                    <div onClick={() => setActive("location")} className="flex items-center gap-4 py-4 border-b border-gray-100 cursor-pointer">
                        <Search size={20} className="text-gray-400" />
                        <span className="text-sm text-gray-400 font-medium truncate">{location || "Where to next?"}</span>
                    </div>

                    <div onClick={() => setActive("checkin")} className="flex items-center gap-4 py-4 border-b border-gray-100 cursor-pointer">
                        <Calendar size={20} className="text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">
                            {startDate ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${endDate ? endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Select'}` : "Oct 24 — Oct 31"}
                        </span>
                    </div>

                    <div onClick={() => setActive("guests")} className="flex items-center gap-4 py-4 cursor-pointer">
                        <Users size={20} className="text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">{guests} Guests</span>
                    </div>

                    <button onClick={handleSubmit} className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm mt-2 active:scale-[0.98] transition-transform">
                        Search
                    </button>
                </div>

                {/* --- SHARED DROPDOWNS --- */}
                <div className="relative mt-2" ref={dropdownRef}>
                    <AnimatePresence>
                        {/* Location Picker */}
                        {active === "location" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute w-full md:w-96 bg-white rounded-xl shadow-xl border p-4 z-50 left-0">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search city or hotel"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </motion.div>
                        )}

                        {/* Date Picker (Calendar) */}
                        {(active === "checkin" || active === "checkout") && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bg-white rounded-2xl shadow-xl border p-6 z-50 left-0 md:left-1/4 -translate-x-0 md:-translate-x-1/2">
                                <div className="flex justify-between items-center mb-4 min-w-[280px]">
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-gray-100 rounded-full">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="font-bold text-sm">
                                        {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
                                    </span>
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-gray-100 rounded-full">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                        <span key={i} className="text-[10px] font-bold text-gray-400 py-2">{d}</span>
                                    ))}
                                    {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => <span key={i} />)}
                                    {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                        const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                                        const isStart = startDate?.toDateString() === day.toDateString();
                                        const isEnd = endDate?.toDateString() === day.toDateString();
                                        const inRange = isInRange(day);
                                        const past = isPastDate(day);

                                        return (
                                            <button
                                                key={i}
                                                disabled={past}
                                                onClick={() => handleDateClick(day)}
                                                className={`w-9 h-9 text-xs rounded-full flex items-center justify-center transition
                                                    ${isStart || isEnd ? "bg-black text-white" : inRange ? "bg-gray-100" : past ? "text-gray-200 cursor-not-allowed" : "hover:bg-gray-50 text-gray-700"}`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between mt-4 border-t pt-4">
                                    <button onClick={() => { setStartDate(null); setEndDate(null); }} className="text-xs text-gray-500 font-medium hover:underline">Clear</button>
                                    <button onClick={() => setActive(null)} className="text-xs text-black font-bold hover:underline">Done</button>
                                </div>
                            </motion.div>
                        )}

                        {/* Guest Picker */}
                        {active === "guests" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute w-[280px] bg-white rounded-2xl shadow-xl border p-6 z-50 right-0 md:right-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-sm">Guests</p>
                                        <p className="text-xs text-gray-400">Number of travelers</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="border rounded-full p-1.5 hover:bg-gray-50"><Minus size={14} /></button>
                                        <span className="font-bold text-sm w-4 text-center">{guests}</span>
                                        <button onClick={() => setGuests(guests + 1)} className="border rounded-full p-1.5 hover:bg-gray-50"><Plus size={14} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}