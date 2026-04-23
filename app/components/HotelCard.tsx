import Image from "next/image";
import {
    Search,
    MapPin,
    Calendar,
    Users,
    Star,
    Wifi,
    Coffee,
    Wind,
    Shield,
    ChevronRight,
    Heart,
    Menu,
    X,
    CreditCard,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import type { HotelListItem } from "../types/hotel";

interface Props {
    hotel: HotelListItem;
}

import Link from 'next/link';

export default function HotelCard({ hotel }: Props) {
    return (
        <div className="group bg-white overflow-hidden transition-all rounded">
            {/* TOP AREA: Image & Heart */}
            <div className="relative h-64 overflow-hidden rounded-xl">
                <img
                    src={hotel.images?.[0] || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=2000"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={hotel.name}
                />

                {/* BADGE (Matches 'POPULAR' or 'BEST VALUE' in screenshot) */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <p className="text-[10px] font-bold tracking-wider text-gray-800">POPULAR</p>
                </div>

                {/* HEART ICON */}
                <button className="absolute top-3 right-3 z-10 p-2 bg-black/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all">
                    <Heart size={18} />
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="py-4 px-2">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900 truncate flex-1">{hotel.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-900 ml-2">
                        <Star size={14} fill="currentColor" />
                        <span>{hotel.averageRating || "4.9"}</span>
                    </div>
                </div>

                {/* LOCATION / DISTANCE (Added from screenshot) */}
                <p className="text-sm text-gray-400 mt-1">
                    {hotel.location.city || "Mayfair"}, London • 0.2 miles from center
                </p>

                {/* FOOTER AREA */}
                <div className="flex justify-between items-end mt-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Starting from</span>
                        <p className="text-xl font-bold text-gray-900">
                            ${540}<span className="text-sm font-normal text-gray-500"> / night</span>
                        </p>
                    </div>

                    {/* VIEW STAY BUTTON (The black button from the screenshot) */}
                    <Link
                        href={`/hotels/${hotel._id}`}
                        className="bg-black text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                        View Stay
                    </Link>
                </div>
            </div>
        </div>
    );
}
