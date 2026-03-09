"use client";

import { Payment } from "@/types/payments";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface PaymentTableProps {
    data?: Payment[];
    isLoading: boolean;
}

export function PaymentTable({ data, isLoading }: PaymentTableProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-base text-center">
                        <thead className="bg-[#f8fafc] text-xs font-semibold text-gray-500 border-b border-gray-100 h-12">
                            <tr>
                                <th className="px-6 py-3 font-medium">Transaction ID</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Description</th>
                                <th className="px-6 py-3 font-medium">Amount</th>
                                <th className="px-6 py-3 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, index) => (
                                <tr key={index} className="border-b border-gray-50 last:border-0 h-[72px]">
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-24 mx-auto" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-28 mx-auto" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-56 mx-auto" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-20 mx-auto" /></td>
                                    <td className="px-6 py-4 flex justify-center items-center"><Skeleton className="h-6 w-20 rounded-sm" /></td>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Payments Found</h3>
                <p className="text-sm text-gray-500">You don&apos;t have any payment history yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-base text-center whitespace-nowrap">
                    <thead className="bg-[#eef2f6] text-xs font-semibold text-gray-600 border-b border-gray-100 h-12">
                        <tr>
                            <th className="px-6 py-3 font-medium tracking-wide">Transaction ID</th>
                            <th className="px-6 py-3 font-medium tracking-wide">Date</th>
                            <th className="px-6 py-3 font-medium tracking-wide">Description</th>
                            <th className="px-6 py-3 font-medium tracking-wide">Amount</th>
                            <th className="px-6 py-3 font-medium tracking-wide text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((payment) => {
                            // Format ID exactly like the screenshot PAY-XXX
                            const transactionId = `PAY-${payment._id.slice(-3).toUpperCase()}`;

                            // Format Date yyyy-MM-dd
                            const formattedDate = payment.createdAt
                                ? format(new Date(payment.createdAt), "yyyy-MM-dd")
                                : "—";

                            // Format Description based on payment type
                            const description = payment.paymentType === "subscription"
                                ? "Premium Plan - Westlands Apartment" // Matching screenshot text
                                : payment.paymentType === "one-time"
                                    ? "One-time Payment"
                                    : "Payment";

                            // Format Amount exactly like KSh 5,000 (Note: The user asked for KSh not KSH in table)
                            const formattedAmount = `KSh ${payment.amount.toLocaleString()}`;

                            return (
                                <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors h-[72px]">
                                    <td className="px-6 py-4 font-semibold text-gray-900">{transactionId}</td>
                                    <td className="px-6 py-4 text-gray-500">{formattedDate}</td>
                                    <td className="px-6 py-4 text-gray-500">{description}</td>
                                    <td className="px-6 py-4 text-gray-500">{formattedAmount}</td>
                                    <td className="px-6 py-4 flex justify-center items-center h-full">
                                        <PaymentStatusBadge status={payment.status} />
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
