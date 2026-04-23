import HotelCard from "../components/HotelCard";
import { GetHotelsResponse, HotelListItem } from "../types/hotel"
import {
    ChevronRight,
} from 'lucide-react';

async function getHotels(): Promise<HotelListItem[]> {
    const res = await fetch("http://localhost:8000/api/v1/hotel/hotels");

    const json: GetHotelsResponse = await res.json();

    return json.hotels;
}

export default async function HomePage() {
    const hotels = await getHotels();
    console.log("result", hotels)
    return (

        <section className="max-w-7xl mx-auto px-4 py-20">

            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Destinations</h2>
                    <p className="text-gray-500">Based on guest reviews and bookings</p>
                </div>
                <button className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    View all <ChevronRight size={16} />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {hotels?.length && hotels?.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} />
                ))}
            </div>

        </section>
    );
}
