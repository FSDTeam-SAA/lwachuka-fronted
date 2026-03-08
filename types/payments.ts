export type PaymentStatus = "completed" | "pending" | "cancelled" | "failed";
export type PaymentType = "subscription" | "one-time";

export interface Payment {
    _id: string;
    user: string;
    subscriber: string;
    amount: number;
    stripeSessionId: string;
    stripePaymentIntentId?: string;
    paymentType: PaymentType;
    currency: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentStats {
    totalSpent: number;
    completedPayments: number;
    pendingPayments: number;
}

export interface PaymentsListResponse {
    statusCode: number;
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: Payment[];
}
