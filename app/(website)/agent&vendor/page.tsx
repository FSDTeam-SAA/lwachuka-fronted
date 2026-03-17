
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VendorCard from "@/components/common/VendorCard";
import { VendorCardSkeleton } from "@/components/skeleton/VendorCardSkeleton";
import { useSession } from "next-auth/react";

type TabKey = "agent" | "vendor";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  role: "agent" | "vendor";
  email?: string;
  status?: string;
  phoneNumber?: string;
  profileImage?: string;
  approvedPropertyCount?: number;
  advertisementCount?: number;
};

type ApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: User[];
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

async function fetchUsers(role: TabKey): Promise<ApiResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/all-users?role=${role}`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch ${role}s`);
  }

  return res.json();
}

export default function TrustedAgentsVendors() {
  const { data: session } = useSession();
  const userId = session?.user?._id as string | undefined;
  const isLoggedIn = !!userId;

  const [tab, setTab] = useState<TabKey>("agent");
  const agentsQuery = useQuery<ApiResponse, Error>({
    queryKey: ["agents"],
    queryFn: () => fetchUsers("agent"),
    staleTime: 5 * 60 * 1000,
    enabled: tab === "agent",
  });

  const vendorsQuery = useQuery<ApiResponse, Error>({
    queryKey: ["vendors"],
    queryFn: () => fetchUsers("vendor"),
    staleTime: 5 * 60 * 1000,
    enabled: tab === "vendor",
  });

  const currentQuery = tab === "agent" ? agentsQuery : vendorsQuery;

  const filtered = currentQuery.data?.data || [];
  const isLoading = currentQuery.isLoading;
  const error = currentQuery.error?.message || null;
  const showEmpty = !isLoading && filtered.length === 0;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[22px] sm:text-[40px] font-extrabold text-slate-900">
            Our Trusted{" "}
            <span className="text-[#D3920E]">Agents & Vendors</span>
          </h2>
          <p className="text-[12px] sm:text-[18px] text-[#7D7D7D]">
            Connect with experienced professionals to find your perfect property
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex items-center gap-6">
          <button
            onClick={() => setTab("agent")}
            className={cn(
              "relative pb-3 text-[16px] font-semibold transition-colors",
              tab === "agent"
                ? "text-slate-900"
                : "text-slate-400 hover:text-slate-700"
            )}
          >
            Agent
            <span
              className={cn(
                "absolute left-0 -bottom-[1px] h-[2px] w-full rounded-full transition-all",
                tab === "agent" ? "bg-slate-900" : "bg-transparent"
              )}
            />
          </button>

          <button
            onClick={() => setTab("vendor")}
            className={cn(
              "relative pb-3 text-[16px] font-semibold transition-colors",
              tab === "vendor"
                ? "text-slate-900"
                : "text-slate-400 hover:text-slate-700"
            )}
          >
            Vendor
            <span
              className={cn(
                "absolute left-0 -bottom-[1px] h-[2px] w-full rounded-full transition-all",
                tab === "vendor" ? "bg-slate-900" : "bg-transparent"
              )}
            />
          </button>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <VendorCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={() => currentQuery.refetch()}
              className="mt-4 text-blue-600 underline"
            >
              Try again
            </button>
          </div>
        ) : showEmpty ? (
          <div className="mt-10 text-center text-gray-500">
            No {tab === "agent" ? "agents" : "vendors"} found at the moment.
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <VendorCard
                key={item._id}
                role={item.role}
                id={item._id}
                name={`${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() || "Unknown"}
                company={item.email?.split("@")[0] || "Company"}
                listings={item.approvedPropertyCount ?? 0}
                advertisementCount={item.advertisementCount ?? 0}
                image={item.profileImage || "/vendor.png"}
                phoneNumber={item.phoneNumber}
                requireLoginForWhatsApp
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
