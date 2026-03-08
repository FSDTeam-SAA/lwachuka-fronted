import api from "@/lib/api";
import {
    SubscriptionsListResponse,
    MpesaPaymentPayload,
    MpesaPaymentResponse
} from "@/types/promotions";

export const promotionKeys = {
    all: ["promotions"] as const,
    subscriptions: () => [...promotionKeys.all, "subscriptions"] as const,
};

// GET /subscriber/
export const getSubscriptions = async (
    token?: string
): Promise<SubscriptionsListResponse> => {
    const res = await api.get(`/subscriber/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
};

// POST /subscriber/pad-listing-mpesa/:subscriptionId
export const initiateMpesaPayment = async (
    subscriptionId: string,
    payload: MpesaPaymentPayload,
    token?: string
): Promise<MpesaPaymentResponse> => {
    const res = await api.post(
        `/subscriber/pad-listing-mpesa/${subscriptionId}`,
        payload,
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
    );
    return res.data;
};
