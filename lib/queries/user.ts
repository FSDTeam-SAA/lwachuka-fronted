import api from "@/lib/api";
import { ApiResponse, ChangePasswordPayload, UpdateProfilePayload, User } from "@/types/user";

export const userKeys = {
    all: ["user"] as const,
    detail: (id: string) => [...userKeys.all, id] as const,
};

// GET /user/:id
export const getUser = async (id: string, token?: string): Promise<ApiResponse<User>> => {
    const res = await api.get(`/user/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
};

// PUT /user/:id (multipart/form-data for profile image support)
export const updateUser = async (
    id: string,
    payload: UpdateProfilePayload,
    token?: string
): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value as string | Blob);
        }
    });

    const headers: Record<string, string> = { "Content-Type": "multipart/form-data" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await api.put(`/user/profile`, formData, { headers });
    return res.data;
};

// POST /auth/change-password
export const changePassword = async (
    payload: ChangePasswordPayload
): Promise<ApiResponse<null>> => {
    const res = await api.post("/auth/change-password", payload);
    return res.data;
};
