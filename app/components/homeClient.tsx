
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Hero from "./Hero";
import HotelCard from "./HotelCard";
import { ChevronRight } from "lucide-react";
import { HotelListItem } from "@/app/types/hotel";
import { getHotels } from "@/app/lib/api";
import toast from "react-hot-toast";
import HotelCardSkeleton from "./hotel/HotelCardSkeleton";
import Notfound from "./Notfound";
import { useAppSelector } from "../redux/hook/hooks";

interface Props {
    initialData: HotelListItem[];
    initialPagination: {
        currentPage: number;
        totalPages: number;
    };
}

export default function HomeClient({ initialData, initialPagination }: Props) {
    const [filters, setFilters] = useState({});
    const filterData = useAppSelector((state) => state.bookingFilters);

    const {
        data,
        error,
        isError,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["hotels", filters],

        queryFn: ({ pageParam = 1 }) =>
            getHotels({
                page: pageParam,
                ...filters,
            }),

        initialPageParam: 1,

        initialData: {
            pages: [
                {
                    data: {
                        hotels: initialData,
                        pagination: initialPagination
                    },
                },
            ],
            pageParams: [1],
        },

        getNextPageParam: (lastPage) => {
            const current = lastPage.data.pagination.currentPage;
            const total = lastPage.data.pagination.totalPages;
            return current < total ? current + 1 : undefined;
        },
    });

    useEffect(() => {
        if (isError) {
            toast.error(`Error fetching hotels: ${(error as Error).message}`);
        }
    }, [isError, error]);

    useEffect(() => {
        setFilters(filterData)
    }, [filterData])

    // Flatten all pages into one array
    const hotels = data?.pages.flatMap((page) => page.data.hotels) ?? [];
    // onFilter={setFilters}

    return (
        <>
            <Hero />

            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Popular Destinations
                        </h2>
                        <p className="text-gray-500">Based on guest reviews and bookings</p>
                    </div>

                    {hasNextPage && (
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                        >
                            {isFetchingNextPage ? "Loading..." : "Show more"}
                            <ChevronRight size={16} />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? [...Array(8)].map((_, i) => (
                        <HotelCardSkeleton key={i} />
                    )) : !hotels.length ?
                        <Notfound heading={"No Hotels Found"} />
                        : hotels.map((hotel) => (
                            <HotelCard key={hotel._id} hotel={hotel} />
                        ))}
                </div>
            </section>
        </>
    );
}
