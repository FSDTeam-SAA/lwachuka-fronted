
"use client";

import { useQuery } from "@tanstack/react-query";
import VendorCard from "../common/VendorCard";
import { VendorCardSkeleton } from "../skeleton/VendorCardSkeleton";

interface Agent {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  profileImage?: string;
  approvedPropertyCount?: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Agent[];
}

async function fetchAgents(): Promise<ApiResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/all-users?role=agent`, {
    cache: "no-store", 
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch agents");
  }

  return res.json();
}

export function AgentsSection() {
  const { data, isLoading, error } = useQuery<ApiResponse, Error>({
    queryKey: ["agents"],
    queryFn: fetchAgents,
    staleTime: 5 * 60 * 1000, 
  });

  const agents = data?.data || [];

  // Optional: you can limit to top 3, 6, etc.
  const displayedAgents = agents.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
            Meet <span className="text-[#D3920E]">Our Top</span> Agents
          </h2>

          <p className="mt-3 text-sm md:text-base text-[#8A8A8A]">
            Work with verified, professional real estate agents to find your perfect property
          </p>
        </div>

        {/* Cards / Skeletons */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <VendorCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            Failed to load agents. Please try again later.
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No agents found at the moment.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedAgents.map((agent) => {
              const name = `${agent.firstName ?? ""} ${agent.lastName ?? ""}`.trim() || "Unknown";
              const company = agent.email?.split("@")[0] || "Company";
              const image = agent.profileImage || "/vendor.png";

              return (
                <VendorCard
                  key={agent._id}
                  role="agent"
                  id={agent._id}
                  name={name}
                  company={company}
                  image={image}
                  listings={agent.approvedPropertyCount ?? 0}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
