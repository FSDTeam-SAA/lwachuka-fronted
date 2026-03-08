export type BookingStatus = "pending" | "approved" | "cancelled" | "completed";

export interface BookingUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export interface BookingProperty {
    _id: string;
    title: string;
    location: string;
    images: string[];
}

export interface Booking {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    moveInData: string;
    phone: string;
    customMessage: string;
    user: BookingUser;
    property: BookingProperty;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
}

export interface BookingsListResponse {
    statusCode: number;
    success: boolean;
    message: string;
    meta: { page: number; limit: number; total: number };
    data: Booking[];
}

export interface UpdateBookingStatusPayload {
    status: BookingStatus;
}
