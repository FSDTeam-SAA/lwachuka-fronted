import api from "@/lib/api";
import { Booking, BookingsListResponse, BookingStatus, UpdateBookingStatusPayload } from "@/types/calendar";

export const calendarKeys = {
    all: ["calendar"] as const,
    bookings: (status: BookingStatus) => [...calendarKeys.all, status] as const,
};

// GET /calender/my-agent-bookings?status=pending
export const getAgentBookings = async (
    status: BookingStatus = "pending",
    token?: string
): Promise<BookingsListResponse> => {
    const params = { status, limit: 100 }; // Ensure we get enough to populate the calendar
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
