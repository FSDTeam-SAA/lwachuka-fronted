import { PaymentStatus } from "@/types/payments";

interface PaymentStatusBadgeProps {
    status: PaymentStatus;
}

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
    completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-600 border-red-200" },
    failed: { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-semibold border ${config.className}`}
        >
            {config.label}
        </span>
    );
}
