"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionCardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-10">
            {[...Array(3)].map((_, index) => (
                <div
                    key={index}
                    className={`bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col h-[500px] ${index === 1 ? "scale-105 border-[#0D1B2A] shadow-xl" : ""
                        }`}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-6 w-24" />
                    </div>

                    <div className="mb-8">
                        <Skeleton className="h-10 w-48 mb-2" />
                    </div>

                    <div className="space-y-4 mb-10 flex-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>

                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            ))}
        </div>
    );
}
