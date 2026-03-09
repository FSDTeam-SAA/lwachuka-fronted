"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface PaymentStatCardsProps {
    totalSpent: number;
    completedPayments: number;
    pendingPayments: number;
    isLoading: boolean;
}

export function PaymentStatCards({
    totalSpent,
    completedPayments,
    pendingPayments,
    isLoading,
}: PaymentStatCardsProps) {

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100">
                        <Skeleton className="h-3 w-24 mb-3" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Spent */}
            <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Spent</p>
                <h3 className="text-3xl font-bold text-[#0D1B2A]">
                    KSH {totalSpent.toLocaleString()}
                </h3>
            </div>

            {/* Completed Payments */}
            <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Completed Payments</p>
                <h3 className="text-3xl font-bold text-[#0D1B2A]">{completedPayments}</h3>
            </div>

            {/* Pending Payments */}
            <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pending Payments</p>
                <h3 className="text-3xl font-bold text-[#0D1B2A]">{pendingPayments}</h3>
            </div>
        </div>
    );
}
