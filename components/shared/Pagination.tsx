"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    // Let the user overwrite itemsPerPage if not 10
    itemsPerPage?: number;
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    itemsPerPage = 10,
}: PaginationProps) {
    // Logic to calculate exact items showing
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Helper to generate pagination range
    const getPaginationRange = () => {
        const range: (number | "...")[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
            return range;
        }

        // Always include 1
        range.push(1);

        if (currentPage > 3) {
            range.push("...");
        }

        // Current page and its neighbors
        const prev = Math.max(2, currentPage - 1);
        const next = Math.min(totalPages - 1, currentPage + 1);

        for (let i = prev; i <= next; i++) {
            if (i === 1 || i === totalPages) continue;
            range.push(i);
        }

        if (currentPage < totalPages - 2) {
            range.push("...");
        }

        // Always include last page
        range.push(totalPages);

        return range;
    };

    const pages = getPaginationRange();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <p className="text-sm text-gray-500">
                Showing {startItem} to {endItem} of <span className="font-semibold">{totalItems}</span> results
            </p>

            {totalPages > 0 && (
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-md border-gray-200 text-gray-500 hover:text-gray-900"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {pages.map((page, index) => {
                        if (page === "...") {
                            return (
                                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                className={`h-8 w-8 min-w-[32px] p-0 font-medium ${currentPage === page
                                        ? "bg-[#0D1B2A] text-white hover:bg-[#1A3A5C] border-[#0D1B2A]"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                onClick={() => onPageChange(page as number)}
                            >
                                {page}
                            </Button>
                        );
                    })}

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-md border-gray-200 text-gray-500 hover:text-gray-900"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
