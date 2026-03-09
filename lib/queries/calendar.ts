import api from "@/lib/api";
import { Booking, BookingsListResponse, BookingStatus, UpdateBookingStatusPayload } from "@/types/calendar";

export const calendarKeys = {
    all: ["calendar"] as const,
    bookings: (status: BookingStatus, page?: number) => page ? [...calendarKeys.all, status, page] as const : [...calendarKeys.all, status] as const,
};

// GET /calender/my-agent-bookings?status=pending
export const getAgentBookings = async (
    status: BookingStatus = "pending",
    token?: string,
    page: number = 1,
    limit: number = 100
): Promise<BookingsListResponse> => {
    const params = { status, page, limit };
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await api.get(`/calender/my-agent-bookings`, {
        params,
        headers,
    });
    return res.data;
};

// PUT /calender/status/:bookingId
export const updateBookingStatus = async (
    bookingId: string,
    payload: UpdateBookingStatusPayload,
    token?: string
): Promise<{ message: string; data: Booking }> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await api.put(`/calender/status/${bookingId}`, payload, {
        headers,
    });
    return res.data;
};
