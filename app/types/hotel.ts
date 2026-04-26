import { RoomListingItems } from "./room";

export interface HotelAmenity {
    _id: string;
    name: string;
}

export interface HotelLocation {
    type: "Point";
    coordinates: [number, number];
    country: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface HotelListItem {
    _id: string;
    name: string;
    description: string;
    images: string[];
    owner: string;
    amenities: HotelAmenity[];
    location: HotelLocation;
    averageRating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    room: RoomListingItems,
    isActive: boolean;
}

export type HotelMainPageData = {
    hotels: HotelListItem[];
    pagination: {
        currentPage: number;
        totalPages: number;
    };
};

export interface GetHotelsResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        hotels: HotelListItem[];
        pagination: {
            currentPage: number;
            totalPages: number;
        };
    };
}


