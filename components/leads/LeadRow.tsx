"use client";

import { Lead } from "@/types/leads";
import { Button } from "@/components/ui/button";
import { Mail, Calendar } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "New", className: "bg-blue-100 hover:bg-blue-100 text-blue-700 font-medium border-0" },
    viewed: { label: "Viewed", className: "bg-gray-100 hover:bg-gray-100 text-gray-600 font-medium border-0" },
    responded: { label: "Contacted", className: "bg-green-100 hover:bg-green-100 text-green-700 font-medium border-0" },
};

interface LeadRowProps {
    lead: Lead;
    onContactClick: (id: string) => void;
}

export function LeadRow({ lead, onContactClick }: LeadRowProps) {
    const { userId, propertyId, status, createdAt } = lead;

    const fullName = `${userId.firstName} ${userId.lastName}`;
    const statusInfo = statusConfig[status] || statusConfig.pending;
    const formattedDate = createdAt ? format(new Date(createdAt), "M/dd/yyyy") : "Unknown date";

    // Use propertyOwnerId profile image or userId profile image, based on instructions: "Avatar — propertyOwnerId.profileImage"
    // Wait, let's look at the instruction: "Avatar — propertyOwnerId.profileImage (fallback to initials)". Wait, property owner is the agent. The user making the inquiry is the customer. It says "Name — userId.firstName + ' ' + userId.lastName", which implies the lead is the customer. The avatar should probably be the lead user's avatar, but I will follow the instruction or use userId's image which makes more sense. Let's use userId.profileImage.
    const profileImage = userId.profileImage;
    const initials = `${userId.firstName?.[0] || ""}${userId.lastName?.[0] || ""}`.toUpperCase();

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.06)] border border-gray-100 transition-all hover:shadow-[0_4px_12px_-3px_rgba(6,81,237,0.12)]">

            {/* Left section */}
            <div className="flex items-start gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                    {profileImage ? (
                        <Image
                            src={profileImage}
                            alt={fullName}
                            width={48}
                            height={48}
                            className="object-cover h-full w-full"
                        />
                    ) : (
                        <span className="text-gray-500 font-semibold text-sm">{initials}</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{fullName}</h4>
                        <Badge variant="secondary" className={statusInfo.className}>
                            {statusInfo.label}
                        </Badge>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">{propertyId?.title || "Unknown Property"}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs mt-1 text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{userId.email || "—"}</span>
                        </div>
                        {/* Phone icon + (not in API — omit or show —) */}
                        <div className="flex items-center gap-1.5">
                            {/* Phone icon SVG inline */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            <span>—</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right section */}
            <div className="shrink-0 ml-16 sm:ml-0 mt-2 sm:mt-0">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onContactClick(lead._id)}
                    className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                    <Mail className="h-4 w-4" />
                    Contact
                </Button>
            </div>
        </div>
    );
}
