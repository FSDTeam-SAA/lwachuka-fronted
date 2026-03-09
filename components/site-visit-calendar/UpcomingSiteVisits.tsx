"use client";

import { Booking, BookingStatus } from "@/types/calendar";
import { BookingCard } from "./BookingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Pagination } from "@/components/shared/Pagination";

interface UpcomingSiteVisitsProps {
    bookings: Booking[];
    isLoading: boolean;
    selectedDate: Date | null;
    pendingBookingId: string | null;
    onApprove: (id: string, currentStatus: BookingStatus) => void;
    onDecline: (id: string, currentStatus: BookingStatus) => void;
    onRevert?: (id: string, newStatus: BookingStatus) => void;
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
}

export function UpcomingSiteVisits({
    bookings,
    isLoading,
    selectedDate,
    pendingBookingId,
    onApprove,
    onDecline,
    onRevert,
    currentPage = 1,
    totalPages = 0,
    totalItems = 0,
    onPageChange,
}: UpcomingSiteVisitsProps) {

    // Filter out duplicates based on _id, since user reported repeating cards
    const uniqueBookings = bookings.filter((booking, index, self) =>
        index === self.findIndex((t) => t._id === booking._id)
    );

    if (isLoading) {
        return (
            <div className="mt-8">
                <h2 className="text-xl font-bold text-[#0D1B2A] mb-6">Upcoming Site Visits</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-[210px] bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-4">
                            <div className="flex gap-4">
                                <Skeleton className="h-20 w-24 rounded-lg shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/3" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <Skeleton className="h-10 rounded-md" />
                                <Skeleton className="h-10 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-[#0D1B2A] mb-6">Upcoming Site Visits</h2>

            {uniqueBookings.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center flex flex-col items-center">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {selectedDate
                            ? `No visits on ${format(selectedDate, "MMMM d, yyyy")}`
                            : "No upcoming site visits found"}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {selectedDate
                            ? "Select another date or view all pending requests."
                            : "Pending site visit requests from users will appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {uniqueBookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                isPending={pendingBookingId === booking._id}
                                onApprove={onApprove}
                                onDecline={onDecline}
                                onRevert={onRevert}
                            />
                        ))}
                    </div>
                    {onPageChange && totalItems > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            onPageChange={onPageChange}
                            itemsPerPage={4}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
