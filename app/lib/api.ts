import { HotelListItem } from "@/app/types/hotel";

type ApiOptions = RequestInit & {
    auth?: boolean;
    isformdata?: boolean;
};

const API_URL = "http://localhost:8000/api/v1/";


type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    [key: string]: any;
};

export async function apiFetch<T = any>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<ApiResponse<T>> {
    const { auth = false, isformdata = false, headers, ...rest } = options;

    const makeRequest = async () => {
        return fetch(`${API_URL}${endpoint}`, {
            ...rest,
            credentials: "include",
            headers: {
                ...(!isformdata && { "Content-Type": "application/json" }),
                ...headers,
            },
        });
    };

    try {

        let res = await makeRequest();

        if (res.status === 401 && auth) {
            await refreshAccessToken();
            res = await makeRequest();
        }

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data?.message || "Request failed",
                ...data,
            };
        }

        return {
            success: true,
            ...data,
        };

    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Network error",
        };
    }
}


async function refreshAccessToken(): Promise<string | null> {
    try {

        const res = await fetch(`${API_URL}user/refresh-token`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.accessToken;
    } catch {
        return null;
    }
}




interface HotelsApiResponse {
    data: {
        hotels: HotelListItem[];
        pagination: {
            currentPage: number;
            totalPages: number;
        };
    };
}

export async function getHotels(params: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`http://localhost:8000/api/v1/hotel/hotels?${query}`);

    if (!res.ok) throw new Error("Failed to fetch hotels");

    const json = await res.json();

    return {
        data: {
            hotels: json.data.hotels,
            pagination: json.data.pagination,
        },
    };
}


