"use client";

import { Property } from "@/types/listings";
import { ListingStatusBadge } from "./ListingStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface ListingTableProps {
    data?: Property[];
    isLoading: boolean;
}

export function ListingTable({ data, isLoading }: ListingTableProps) {
    const { data: session } = useSession();
    const agentName = session?.user?.firstName && session?.user?.lastName
        ? `${session.user.firstName} ${session.user.lastName}`
        : "—";

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#f8fafc] text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, index) => (
                                <tr key={index} className="border-b border-gray-50 last:border-0">
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] border border-gray-100 p-12 text-center flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Listings Found</h3>
                <p className="text-sm text-gray-500">You haven&apos;t added any properties yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-[#f8fafc] text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Title</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Location</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Type</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Agent</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((property) => {
                            // Format price: KES 1.3M
                            const rawPrice = property.price || 0;
                            const formattedPrice = `KES ${(rawPrice / 1_000_000).toFixed(1)}M`;

                            // Strip "For " prefix if present
                            const displayType = property.listingType?.replace(/^For /i, "") || "—";

                            return (
                                <tr key={property._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-12 rounded-md bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                {property.images && property.images[0] ? (
                                                    <Image
                                                        src={property.images[0]}
                                                        alt={property.title}
                                                        width={48}
                                                        height={40}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="truncate max-w-[200px] sm:max-w-xs">{property.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <span className="truncate max-w-[150px] inline-block">{property.location}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">{formattedPrice}</td>
                                    <td className="px-6 py-4 text-gray-500">{displayType}</td>
                                    <td className="px-6 py-4 text-gray-500">{agentName}</td>
                                    <td className="px-6 py-4">
                                        <ListingStatusBadge status={property.status} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
