import api from "@/lib/api";
import { PaymentsListResponse } from "@/types/payments";

export const paymentKeys = {
    all: ["payments"] as const,
    list: (page: number) => [...paymentKeys.all, "list", page] as const,
};

// GET /payment/my?page=1&limit=10
export const getMyPayments = async (
    page: number,
    token?: string
): Promise<PaymentsListResponse> => {
    const params = { page, limit: 10 };
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await api.get(`/payment/my`, {
        params,
        headers,
    });
    return res.data;
};
