"use client"
import React, { useState, useEffect, useMemo } from 'react';
import {
    Users,
    BedDouble,
    ShieldCheck,
    Calendar,
    Info,
    CheckCircle2,
    CircleMinus,
    Search,
    ArrowRight,
    Star,
    MapPin,
    Share,
    Heart
} from 'lucide-react';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HotelListItem } from '@/app/types/hotel';
import { RoomListingItems } from '@/app/types/room';
import { apiFetch } from '@/app/lib/api';
import MapComponent from '@/app/components/GoogleMaps';
import Hero from '@/app/components/Hero';
import { useAppSelector } from '@/app/redux/hook/hooks';

// Mocked room data representing what comes from your Room.aggregate(pipeline)
const MOCK_ROOMS = [
    {
        _id: "r1",
        name: "Deluxe King Room",
        type: "Deluxe",
        capacity: 2,
        price: 150,
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800"],
        amenities: ["King Bed", "Ocean View", "Mini Bar"],
        // In a real app, this would be computed by your MongoDB pipeline based on dates
        bookings: [
            { checkIn: "2024-05-15", checkOut: "2024-05-18" }
        ],
        isAvailable: false
    },
    {
        _id: "r2",
        name: "Family Suite",
        type: "Suite",
        capacity: 4,
        price: 280,
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"],
        amenities: ["2 Queen Beds", "Living Area", "Kitchenette"],
        bookings: [],
        isAvailable: true
    },
    {
        _id: "r3",
        name: "Single Budget Room",
        type: "Standard",
        capacity: 1,
        price: 80,
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800"],
        amenities: ["Single Bed", "Work Desk"],
        bookings: [
            { checkIn: "2024-05-10", checkOut: "2024-05-12" }
        ],
        isAvailable: true
    }
];



export default function HotelDetailPage() {
    // 1. Filter States (Mapping to your req.query)
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [capacity, setCapacity] = useState<number | null>(null);
    const [price, setPrice] = useState(2000);
    const [hotelData, sethotelData] = useState<HotelListItem | null>(null)
    const [roomData, setRoomData] = useState<RoomListingItems[] | []>([])
    const { id } = useParams();
    const filterData = useAppSelector((state) => state.bookingFilters)
    // const navigate = useNavigate();

    const bookingPath = `/bookings?hotelId=${id}&checkIn=${checkIn}&checkOut=${checkOut}&capacity=${capacity}&price=${price}`

    const handleNavigate = () => {
        // navigate(`/bookings?hotelId=${id}&checkIn=${checkIn}&checkOut=${checkOut}&capacity=${capacity}&price=${price}`);
    }

    // 2. Client-side simulation of your MongoDB Aggregate Pipeline
    const filteredRooms = useMemo(() => {
        return MOCK_ROOMS.filter(room => {
            // matchStage.capacity = { $gte: parseInt(capacity) }
            if (capacity && room.capacity < capacity) return false;

            // matchStage.price = { $gte: parseInt(price) } 
            // Note: Usually frontend uses price as "Max Price", but your controller uses $gte.
            // I will implement it as "Max Price" for better UX, matching the slider logic.
            if (room.price > price) return false;

            // isAvailable logic simulation (The $filter/$cond in your pipeline)
            if (checkIn && checkOut) {
                const userCI = new Date(checkIn);
                const userCO = new Date(checkOut);

                const hasOverlap = room.bookings.some(booking => {
                    const bCI = new Date(booking.checkIn);
                    const bCO = new Date(booking.checkOut);
                    // Your backend logic: checkIn < booking.checkOut && checkOut > booking.checkIn
                    return userCI < bCO && userCO > bCI;
                });

                if (hasOverlap) return false;
            }

            return true;
        });
    }, [capacity, price, checkIn, checkOut]);

    // const hotelData = {
    //     location: { coordinates: [35.2576888, 76.3038962] as [number, number], city: "Khaplu", state: "Gilgit-Baltistan", country: "Pakistan" },
    //     name: "Grand City Hotel",
    //     description: "Experience the majestic beauty of Khaplu. Our hotel offers a perfect blend of modern comfort and traditional Balti hospitality.",
    //     amenities: [
    //         { name: "Free WiFi", icon: <Wifi size={18} /> },
    //         { name: "Heating", icon: <Wind size={18} /> },
    //         { name: "Mountain View", icon: <Maximize size={18} /> },
    //         { name: "24/7 Reception", icon: <Clock size={18} /> }
    //     ]
    // };

    const getHotelsData = async () => {
        try {
            const res: any = await apiFetch(`hotel/get/${id}`, {
                method: "GET",
            }

            );
            if (res.success) {
                sethotelData(res.data)
            }

        } catch (err) {
            // setError("Invalid email or password. Please try again.");
        } finally {
            // setLoading(false);
        }
    }

    const getRoomData = async () => {
        try {
            const query = new URLSearchParams({
                capacity: filterData?.capacity ? filterData.capacity.toString() : "",
                price: price?.toString() || "",
                checkIn: filterData?.startDate || "",
                checkOut: filterData?.endDate || "",
            });

            const res: any = await apiFetch(
                `room/detail/${id}?${query.toString()} `,
                {
                    method: "GET",
                }
            );
            if (res.success) {
                setRoomData(res?.data);
                sethotelData(res.data?.[0]?.hotelDetails)
            }

        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        getRoomData();
    }, [price, filterData]);

    useEffect(() => {
        // getHotelsData()
    }, [])
    let data = [
        "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.webp?b=1&s=612x612&w=0&k=20&c=0rtxELnoQATKAUby1JKvwQg0KLsldMYWEZCulIHnq0o=",
        "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.webp?b=1&s=612x612&w=0&k=20&c=0rtxELnoQATKAUby1JKvwQg0KLsldMYWEZCulIHnq0o=",
        "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.webp?b=1&s=612x612&w=0&k=20&c=0rtxELnoQATKAUby1JKvwQg0KLsldMYWEZCulIHnq0o=",
        "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.webp?b=1&s=612x612&w=0&k=20&c=0rtxELnoQATKAUby1JKvwQg0KLsldMYWEZCulIHnq0o=",

    ]
    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 ">

            {/* Top Search Bar (Dates & Capacity) */}

            <Hero isDetailPage={true} />

            {/* 2. GALLERY GRID (5 Images) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[350px] md:h-[360px] mb-12 overflow-hidden">
                <div className="md:col-span-2 h-full shrink-0">
                    <img src={data?.[0]} className="w-full h-full object-cover hover:scale-102 transition-transform duration-700 rounded" alt="Main" />
                </div>
                <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-2 h-full">
                    {data.slice(1, 5).map((img, idx) => (
                        <div key={idx} className="overflow-hidden shrink-0 rounded">
                            <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={`Sub ${idx}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-16 order-2 lg:order-1">
                    {/* HOTEL HEADER */}
                    <section>
                        <div className="flex flex-col gap-4 mb-8">
                            <span className="flex items-center w-fit gap-1.5 text-[11px] font-black bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                <Star className="fill-emerald-600" size={12} /> 4.9 (2,450 Reviews)
                            </span>
                            <h1 className="text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">{hotelData?.name}</h1>
                            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                <MapPin size={16} /> London, United Kingdom
                            </div>
                        </div>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">{hotelData?.description}</p>
                    </section>

                    {/* PIXEL PERFECT ROOM CARDS */}
                    <section id="rooms" className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900">Available Rooms</h2>
                            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest mt-1">Select your perfect stay</p>
                        </div>

                        <div className="space-y-8">
                            {roomData.map((room) => (
                                <div key={room._id} className="group bg-white rounded-[40px] border border-gray-100 p-3 flex flex-col md:flex-row gap-8 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                                    {/* Room Image */}
                                    <div className="w-full md:w-80 h-64 shrink-0 rounded-[32px] overflow-hidden">
                                        <img src={room?.images?.[0] || data?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={room.roomType} />
                                    </div>

                                    {/* Room Content */}
                                    <div className="flex-1 pr-6 py-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{room?.roomType}</h3>
                                                <div className="text-right">
                                                    <span className="block text-3xl font-black text-gray-900">${room.price}</span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">per night</span>
                                                </div>
                                            </div>

                                            {/* Features */}
                                            <div className="flex items-center gap-6 mt-6">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Users size={18} className="text-gray-300" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest">{room.capacity} Guests</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <BedDouble size={18} className="text-gray-300" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest">{room.roomType}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-emerald-500">
                                                <CheckCircle2 size={18} />
                                                <span className="text-[11px] font-black uppercase tracking-widest">Available Now</span>
                                            </div>
                                            <Link
                                                href={`/bookings/${room?._id}`}
                                                className="bg-black text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
                                            >
                                                Book Room
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* LOCATION & REVIEWS */}
                    <section className="space-y-8">
                        <h3 className="text-2xl font-black text-gray-900">Location</h3>
                        <div className="w-full h-[400px] rounded-[40px] overflow-hidden border border-gray-100 shadow-inner">
                            <MapComponent coords={hotelData?.location?.coordinates} name={hotelData?.name} />
                        </div>
                    </section>

                    <section className="space-y-10 pb-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-gray-900">Guest Reviews</h3>
                            <button className="text-[11px] font-black text-black uppercase tracking-widest border-b-2 border-black pb-1">All Reviews</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2].map((r) => (
                                <div key={r} className="p-8 bg-gray-50 rounded-[32px] border border-gray-50">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                                        <p className="font-black text-sm text-gray-900">Alexander Wright</p>
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed italic">"The attention to detail at this property is unmatched."</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* SIDEBAR (Refine Search) */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                    <div className="lg:sticky lg:top-24">
                        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50">
                            <h3 className="text-sm font-black text-gray-900 mb-8 uppercase tracking-widest">Refine Search</h3>
                            <div className="space-y-10">
                                <div>
                                    <div className="flex justify-between items-end mb-6">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Price</label>
                                        <span className="text-3xl font-black text-black">${price}</span>
                                    </div>
                                    <input type="range" min="50" max="1000" step="10" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black" />
                                </div>
                                <div className="p-6 bg-emerald-50 rounded-[24px] border border-emerald-100 flex items-start gap-4">
                                    <ShieldCheck className="text-emerald-600 mt-1" size={24} />
                                    <p className="text-[10px] text-emerald-700/80 font-bold leading-relaxed uppercase tracking-tighter">Best Value Guarantee</p>
                                </div>
                                <button className="w-full bg-black text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:bg-gray-900 transition-all">Search Available</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

//  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//                 <div className="lg:col-span-2 space-y-10">
//                     <section>
//                         <h1 className="text-5xl font-black text-gray-900 mb-6">{hotelData?.name || "N/A"}</h1>
//                         <div className="flex flex-wrap gap-4 mb-8">
//                             {hotelData?.amenities.map((amenity, idx) => (
//                                 <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm text-gray-600 text-sm font-semibold">
//                                     {amenity?.name}
//                                 </div>
//                             ))}
//                         </div>
//                         <p className="text-gray-500 text-lg leading-relaxed mb-8">{hotelData?.description}</p>

//                         <div className="w-full h-[300px] mb-10">
//                             <MapComponent coords={hotelData?.location?.coordinates} name={hotelData?.name} />
//                         </div>
//                     </section>

//                     <section id="rooms">
//                         <div className="flex items-end justify-between mb-8">
//                             <div>
//                                 <h2 className="text-3xl font-black text-gray-900">Available Rooms</h2>
//                                 <p className="text-gray-400 font-medium">Showing {roomData.length} rooms based on your filters</p>
//                             </div>
//                         </div>

//                         <div className="space-y-6">
//                             {roomData.length > 0 ? (
//                                 roomData.map((room) => (
//                                     <div key={room._id} className="bg-white rounded-3xl p-4 border border-gray-100 hover:shadow-xl transition-all flex flex-col md:flex-row gap-6">
//                                         <div className="w-full md:w-64 h-44 rounded-2xl overflow-hidden shrink-0">
//                                             <img src={room?.images?.[0]} className="w-full h-full object-cover" alt={room.name} />
//                                         </div>
//                                         <div className="flex-1 flex flex-col justify-between">
//                                             <div>
//                                                 <div className="flex justify-between items-start">
//                                                     <h3 className="text-xl font-black text-gray-900">{room?.roomType}</h3>
//                                                     <span className="text-2xl font-black text-blue-600">${room.price}</span>
//                                                 </div>
//                                                 <div className="flex items-center gap-4 mt-2 text-gray-400 text-[10px] font-black uppercase tracking-wider">
//                                                     <span className="flex items-center gap-1"><Users size={15} /> {room.capacity} Guests</span>
//                                                     <span className="flex items-center gap-1"><BedDouble size={15} /> {room.roomType}</span>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center justify-between mt-4">
//                                                 <span className={`flex items-center gap-1.5 ${room?.isAvailable ? "text-emerald-500" : "text-red-500"} text-sm font-bold`}>
//                                                     {room?.isAvailable ?
//                                                         <>
//                                                             <CheckCircle2 size={16} /> Available
//                                                         </>
//                                                         :
//                                                         <>
//                                                             <CircleMinus size={18} /> Not Available
//                                                         </>
//                                                     }
//                                                 </span>

//                                                 <Link
//                                                     href={room?.isAvailable ? `/bookings/${room?._id}` : "#"}
//                                                     className={`bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2
//                                                     hover:bg-blue-600
//                                                     ${!room?.isAvailable ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}

//                                                 >
//                                                     {room?.isAvailable ? 'Book Room' : 'Sold Out'} <ArrowRight size={14} />
//                                                 </Link>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
//                                     <Info className="mx-auto text-gray-300 mb-4" size={48} />
//                                     <h3 className="text-lg font-bold text-gray-900">No rooms found</h3>
//                                     <p className="text-gray-500">Try adjusting your filters or checking different dates.</p>
//                                 </div>
//                             )}
//                         </div>
//                     </section>
//                 </div>

//                 <div className="lg:col-span-1">
//                     <div className="sticky top-24 bg-white rounded-[32px] p-8 shadow-2xl shadow-gray-200/50 border border-gray-50">
//                         <h3 className="text-xl font-black text-gray-900 mb-6">Refine Search</h3>
//                         <div className="space-y-8">
//                             <div>
//                                 <div className="flex justify-between mb-3">
//                                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Max Price</label>
//                                     <span className="text-sm font-black text-blue-600">${price}</span>
//                                 </div>
//                                 <input
//                                     type="range" min="50" max="1000" step="10"
//                                     value={price}
//                                     onChange={(e) => setPrice(parseInt(e.target.value))}
//                                     className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
//                                 />
//                                 <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-300">
//                                     <span>$50</span>
//                                     <span>$1000</span>
//                                 </div>
//                             </div>

//                             <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
//                                 <div className="flex items-start gap-3">
//                                     <ShieldCheck className="text-blue-600 mt-1" size={20} />
//                                     <div>
//                                         <p className="text-sm font-bold text-blue-900">Khaplu Special Offer</p>
//                                         <p className="text-xs text-blue-700/70 mt-1">Book for more than 3 nights to unlock traditional Balti breakfast.</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>