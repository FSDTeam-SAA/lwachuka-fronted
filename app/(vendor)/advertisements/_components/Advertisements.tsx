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

type Status = "Active" | "Paused" | "Expired";

interface Campaign {
  id: number;
  image: string;
  name: string;
  type: string;
  impressions: string;
  startDate: string;
  endDate: string;
  status: Status;
}

const allCampaigns: Campaign[] = [
  {
    id: 1,
    image: "/images/adv1.jpg",
    name: "Premium Moving Services",
    type: "Banner",
    impressions: "3,421",
    startDate: "2026-02-01",
    endDate: "2026-03-01",
    status: "Active",
  },
  {
    id: 2,
    image: "/images/adv1.jpg",
    name: "Premium Moving Services",
    type: "Banner",
    impressions: "3,421",
    startDate: "2026-03-12",
    endDate: "2026-03-12",
    status: "Active",
  },
  {
    id: 3,
    image: "/images/adv1.jpg",
    name: "Premium Moving Services",
    type: "Banner",
    impressions: "3,421",
    startDate: "2026-03-12",
    endDate: "2026-03-12",
    status: "Paused",
  },
  {
    id: 4,
    image: "/images/adv1.jpg",
    name: "Premium Moving Services",
    type: "Banner",
    impressions: "3,421",
    startDate: "2026-03-12",
    endDate: "2026-03-12",
    status: "Active",
  },
  {
    id: 5,
    image: "/images/adv1.jpg",
    name: "Premium Moving Services",
    type: "Banner",
    impressions: "3,421",
    startDate: "2026-03-12",
    endDate: "2026-03-12",
    status: "Active",
  },
  {
    id: 6,
    image: "/images/adv1.jpg",
    name: "Premium Moving Services",
    type: "Banner",
    impressions: "3,421",
    startDate: "2026-03-12",
    endDate: "2026-03-12",
    status: "Expired",
  },
  {
    id: 7,
    image: "/images/adv1.jpg",
    name: "Home Renovation Experts",
    type: "Popup",
    impressions: "5,102",
    startDate: "2026-01-10",
    endDate: "2026-02-10",
    status: "Expired",
  },
  {
    id: 8,
    image: "/images/adv1.jpg",
    name: "Luxury Real Estate Deals",
    type: "Banner",
    impressions: "8,750",
    startDate: "2026-02-15",
    endDate: "2026-04-15",
    status: "Active",
  },
  {
    id: 9,
    image: "/images/adv1.jpg",
    name: "Fast Property Sales",
    type: "Video",
    impressions: "2,310",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    status: "Paused",
  },
  {
    id: 10,
    image: "/images/adv1.jpg",
    name: "Affordable Movers Co.",
    type: "Banner",
    impressions: "1,980",
    startDate: "2026-02-20",
    endDate: "2026-03-20",
    status: "Expired",
  },
  {
    id: 11,
    image: "/images/adv1.jpg",
    name: "Elite Property Managers",
    type: "Popup",
    impressions: "6,430",
    startDate: "2026-03-05",
    endDate: "2026-05-05",
    status: "Active",
  },
  {
    id: 12,
    image: "/images/adv1.jpg",
    name: "Quick Home Staging",
    type: "Banner",
    impressions: "4,100",
    startDate: "2026-03-10",
    endDate: "2026-04-10",
    status: "Active",
  },
];

const PAGE_SIZE = 5;

const statusStyles: Record<Status, string> = {
  Active: "bg-green-50  text-green-600  border border-green-200",
  Paused: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  Expired: "bg-gray-100  text-gray-500   border border-gray-200",
};

export default function AdvertisementManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allCampaigns.length / PAGE_SIZE);

  const paginated = allCampaigns.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  return (
    <div>
      <Header title="Advertisements" subtitle="Review the advertising plans" />
      <div className="p-6">
        <div className="flex items-center justify-end mb-6">
          <Link href="/advertisements/add-advertisement">
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
                  Campaign Img &amp; Name
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
                {/* <TableHead className="text-xs font-medium text-gray-500 py-3 text-center pr-6">
                  Action
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-100">
                        <Image
                          src={campaign.image}
                          alt={campaign.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-[#1a2341]">
                        {campaign.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-500">
                    {campaign.type}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-500">
                    {campaign.impressions}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-500">
                    {campaign.startDate}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-500">
                    {campaign.endDate}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <span
                      className={`inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[80px] ${statusStyles[campaign.status]}`}
                    >
                      {campaign.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pr-6">
                    <div className="flex items-center justify-center">
                      {/* <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-orange-300 text-orange-400 hover:bg-orange-50 hover:text-orange-500 rounded-md"
                      >
                        <Eye size={14} />
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-400">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, allCampaigns.length)} of{" "}
              {allCampaigns.length} results
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
                    className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors border
                  ${
                    currentPage === page
                      ? "bg-[#1a2341] text-white border-[#1a2341]"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                  >
                    {page}
                  </button>
                ),
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
