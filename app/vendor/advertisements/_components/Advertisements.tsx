"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Header from "../../_components/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface Advertisement {
  _id: string;
  companyName: string;
  advertisementType: string;
  uploadMedia: string;
  compaingBudget: number;
  startDate: string;
  endDate: string;
  paymentStatus: string;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    limit: number;
    page: number;
  };
  data: Advertisement[];
}

const PAGE_SIZE = 5;

export default function AdvertisementManagement() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: adment } = useQuery<ApiResponse>({
    queryKey: ["adv"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/advertisement`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch advertisements");
      }

      return res.json();
    },
  });

  const campaigns: Advertisement[] = adment?.data ?? [];

  const totalPages = Math.ceil(campaigns.length / PAGE_SIZE);

  const paginated = campaigns.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];

    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];

    return [1, "...", currentPage, "...", totalPages];
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US");

  return (
    <div>
      <Header title="Advertisements" subtitle="Review the advertising plans" />

      <div className="p-6">
        <div className="flex items-center justify-end mb-6">
          <Link href="/vendor/advertisements/add-advertisement">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Ad
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-500 py-3 px-6">
                  Campaign Img & Name
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Type
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Impressions
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Start Date
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  End Date
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((campaign) => (
                <TableRow
                  key={campaign._id}
                  className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-100">
                        <Image
                          src={campaign.uploadMedia}
                          alt={campaign.companyName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <span className="text-sm font-medium text-[#1a2341]">
                        {campaign.companyName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-sm text-gray-500">
                    {campaign.advertisementType}
                  </TableCell>

                  <TableCell className="py-3 text-sm text-gray-500">
                    {campaign.compaingBudget}
                  </TableCell>

                  <TableCell className="py-3 text-sm text-gray-500">
                    {formatDate(campaign.startDate)}
                  </TableCell>

                  <TableCell className="py-3 text-sm text-gray-500">
                    {formatDate(campaign.endDate)}
                  </TableCell>

                  <TableCell className="py-3 text-center">
                    <span className="inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[80px] bg-green-50 text-green-600 border border-green-200">
                      {campaign.paymentStatus}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-400">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, campaigns.length)} of{" "}
              {campaigns.length} results
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                ‹
              </button>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="h-8 w-8 flex items-center justify-center text-sm text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(Number(page))}
                    className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors border ${currentPage === page
                        ? "bg-[#1a2341] text-white border-[#1a2341]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}