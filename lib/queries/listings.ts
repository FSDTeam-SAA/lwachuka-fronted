import api from "@/lib/api";
import { PropertiesListResponse } from "@/types/listings";

export const listingKeys = {
    all: ["listings"] as const,
    list: (page: number) => [...listingKeys.all, "list", page] as const,
};

// GET /property/my-property?page=1&limit=10
export const getMyProperties = async (
    page: number,
    token?: string
): Promise<PropertiesListResponse> => {
    const params = { page, limit: 10 };
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await api.get(`/property/my-property`, {
        params,
        headers,
    });
    return res.data;
};
