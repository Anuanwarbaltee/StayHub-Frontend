// import { api } from "./api";
// import { User } from "@/types/user";

// export type LoginPayload = {
//   email: string;
//   password: string;
// };

// export async function loginUser(data: LoginPayload) {
//   return api.post<{ token: string; user: User }>("/auth/login", data);
// }

// export async function registerUser(data: any) {
//   return api.post("/auth/register", data);
// }

export function logout() {
    localStorage.removeItem("token");
}

export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

export function isLoggedIn() {
    return !!getToken();
}
