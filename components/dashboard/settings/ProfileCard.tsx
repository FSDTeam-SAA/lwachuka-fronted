"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser, userKeys } from "@/lib/queries/user";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail } from "lucide-react";

interface ProfileCardProps {
    userId: string;
}

export function ProfileCard({ userId }: ProfileCardProps) {
    const { data, isLoading } = useQuery({
        queryKey: userKeys.detail(userId),
        queryFn: () => getUser(userId),
        enabled: !!userId,
    });

    const user = data?.data;

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <Skeleton className="h-28 w-full" />
                <div className="px-5 pb-5 -mt-10">
                    <Skeleton className="h-20 w-20 rounded-full border-4 border-white" />
                    <Skeleton className="h-5 w-32 mt-3" />
                    <Skeleton className="h-4 w-40 mt-2" />
                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        );
    }

    const fullName = user ? `${user.firstName} ${user.lastName}` : "—";
    const initials = user
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : "?";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Cover Gradient */}
            <div className="h-28 bg-gradient-to-r from-[#0D1B2A] to-[#1A3A5C]" />

            <div className="px-5 pb-5 -mt-10">
                {/* Avatar with edit overlay */}
                <div className="relative w-20 h-20 mb-3">
                    <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                        <AvatarImage src={user?.profileImage} alt={fullName} />
                        <AvatarFallback className="text-lg bg-[#0D1B2A] text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <h3 className="font-semibold text-[#0D1B2A] text-base">{fullName}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>

                <div className="mt-4 space-y-2.5 text-sm text-gray-600">
                    <p>
                        <span className="font-medium text-[#0D1B2A]">Name:</span>{" "}
                        {fullName}
                    </p>
                    {user?.bio && (
                        <p>
                            <span className="font-medium text-[#0D1B2A]">Bio:</span>{" "}
                            <span className="text-xs leading-relaxed">{user.bio}</span>
                        </p>
                    )}
                    <div className="flex items-center gap-1.5 text-xs">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        <span>{user?.phoneNumber || "—"}</span>
                    </div>
                    {user?.location && (
                        <div className="flex items-start gap-1.5 text-xs">
                            <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                            <span>{user.location}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
