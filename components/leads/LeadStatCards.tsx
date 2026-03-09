"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getLeadStats, leadKeys } from "@/lib/queries/leads";
import { Skeleton } from "@/components/ui/skeleton";

export function LeadStatCards() {
    const { data: session } = useSession();
    const token = session?.user?.accessToken;

    const { data: statsData, isLoading } = useQuery({
        queryKey: leadKeys.stats(),
        queryFn: () => getLeadStats(token),
        enabled: !!token,
    });

    const stats = statsData?.data;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100">
                        <Skeleton className="h-4 w-24 mb-3" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Leads */}
            <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Leads</p>
                <h3 className="text-3xl font-bold text-[#0D1B2A]">{stats?.totalInquiry || 0}</h3>
            </div>

            {/* New Leads */}
            <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">New</p>
                <h3 className="text-3xl font-bold text-[#0D1B2A]">{stats?.pendingInquiry || 0}</h3>
            </div>

            {/* Contacted Leads */}
            <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contacted</p>
                <h3 className="text-3xl font-bold text-[#0D1B2A]">{stats?.respondedInquiry || 0}</h3>
            </div>
        </div>
    );
}
