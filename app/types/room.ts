
export interface BookingDate {
    checkIn: string;
    checkOut: string;
}

export interface RoomListingItems {
    _id: string;
    name: string;
    roomType: string;
    capacity: number;
    price: number;
    images: string[];
    amenities: string[];
    bookings: BookingDate[];
    isAvailable: string;
}