import { PropertyStatus } from "@/types/listings";

interface ListingStatusBadgeProps {
    status: PropertyStatus;
}

const statusConfig: Record<PropertyStatus, { label: string; className: string }> = {
    approved: { label: "Approved", className: "bg-green-100/50 text-green-700 border-green-200" },
    pending: { label: "Pending", className: "bg-yellow-100/50 text-yellow-700 border-yellow-200" },
    rejected: { label: "Rejected", className: "bg-red-100/50 text-red-700 border-red-200" },
};

export function ListingStatusBadge({ status }: ListingStatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
        >
            {config.label}
        </span>
    );
}
