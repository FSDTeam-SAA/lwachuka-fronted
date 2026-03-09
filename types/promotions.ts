export interface Subscription {
    _id: string;
    name: string;
    days: number;
    price: number;
    features: string[];
    status: "active" | "inactive";
    users: string[];
    createdAt: string;
    updatedAt: string;
}

export interface SubscriptionsListResponse {
    statusCode: number;
    success: boolean;
    message: string;
    meta: { page: number; limit: number; total: number };
    data: Subscription[];
}

export interface MpesaPaymentPayload {
    phoneNumber: string;
}

export interface MpesaPaymentResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        paymentId: string;
        merchantRequestId: string;
        checkoutRequestId: string;
        message: string;
    };
}
