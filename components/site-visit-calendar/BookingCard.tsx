"use client";

import { Booking, BookingStatus } from "@/types/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar as CalendarIcon, User } from "lucide-react";
import Image from "next/image";

interface BookingCardProps {
    booking: Booking;
    isPending: boolean;
    onApprove: (id: string, currentStatus: BookingStatus) => void;
    onDecline: (id: string, currentStatus: BookingStatus) => void;
    onRevert?: (id: string, newStatus: BookingStatus) => void;
}

export function BookingCard({
    booking,
    isPending,
    onApprove,
    onDecline,
    onRevert,
}: BookingCardProps) {
    const { property, user, moveInData } = booking;

    const formattedDate = moveInData
        ? format(new Date(moveInData), "EEEE, MMMM d, yyyy")
        : "—";

    const fullName = `${user.firstName} ${user.lastName}`;

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            {/* Property Image & Details */}
            <div className="p-5 flex-1 flex flex-col sm:flex-row gap-4">
                {property.images && property.images[0] ? (
                    <div className="h-20 w-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                            src={property.images[0]}
                            alt={property.title}
                            width={96}
                            height={80}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="h-20 w-24 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <MapPin className="h-5 w-5 opacity-50" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-3 truncate" title={property.title}>
                        {property.title}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
                            <span className="truncate" title={property.location}>{property.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" />
                            <span className="truncate">{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 shrink-0 text-gray-400" />
                            <span className="truncate">{fullName}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 mt-auto">
                {booking.status === "approved" ? (
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-green-50 text-green-700 font-medium text-center py-2 rounded-md border border-green-100 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Approved
                        </div>
                        {onRevert && (
                            <Button
                                onClick={() => onRevert(booking._id, "pending")}
                                disabled={isPending}
                                variant="outline"
                                className="shrink-0"
                            >
                                {isPending ? "Editing..." : "Edit Status"}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={() => onApprove(booking._id, booking.status)}
                            disabled={isPending}
                            className="w-full bg-[#0D1B2A] text-white hover:bg-[#1A3A5C]"
                        >
                            {isPending && booking.status === "pending" ? "Approving..." : "Approve"}
                        </Button>
                        <Button
                            onClick={() => onDecline(booking._id, booking.status)}
                            disabled={isPending}
                            variant="outline"
                            className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        >
                            {isPending && booking.status === "pending" ? "Declining..." : "Decline"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
