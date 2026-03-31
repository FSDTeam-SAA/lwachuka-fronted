"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// Optional: define the expected shape
interface Agent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  profileImage?: string;
  approvedPropertyCount?: number;
  advertisementCount?: number;
 
}

// For skeleton & fallback values
const fallbackAgent = {
  name: "Loading...",
  company: "—",
  photo: "/vendor.png",
  specialty: "—",
  activeLabel: "Active Listings",
  activeCount: "—",
  phone: "-",
  email: "—",
};

async function fetchAgent(userId: string): Promise<Agent> {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`);
  return data.data; // we want the nested "data" object
}

export default function AgentDetailsHero() {
  const params = useParams();
  const userId = params?.id as string; 
  const {
    data: agentData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agent", userId],
    queryFn: () => fetchAgent(userId),
    enabled: !!userId, 
    staleTime: 5 * 60 * 1000,
  });

  // Merge real data or use fallback
  const activeLabel =
    agentData?.role === "vendor" ? "Active Advertisement" : "Active Listings";
  const activeCount =
    agentData?.role === "vendor"
      ? agentData?.advertisementCount
      : agentData?.approvedPropertyCount;

  const whatsappLink = buildWhatsAppLink(agentData?.phoneNumber);

  const agent = agentData
    ? {
        name: `${agentData.firstName} ${agentData.lastName}`,
        company: "Prime Properties Kenya",
        photo: agentData.profileImage || fallbackAgent.photo,
        specialty: "Apartment & Condos",
        activeLabel,
        activeCount: activeCount ?? "—",
        phone: agentData.phoneNumber || fallbackAgent.phone,
        email: agentData.email,
      }
    : fallbackAgent;

  if (isError) {
    return (
      <div className="py-14 text-center text-red-600">
        Failed to load agent details. Please try again later.
      </div>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/agent&vendor" 
          className="inline-flex items-center gap-2 text-sm text-[#D3920E] hover:opacity-80"
        >
          ← Back to all agents
        </Link>

        {/* Title */}
        <div className="mt-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
            Our Trusted <span className="text-[#D3920E]">Agents & Vendors</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-[#8A8A8A]">
            Connect with experienced professionals to find your perfect property
          </p>
        </div>

        {/* Main Card + Skeleton */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[340px_1fr]">
            {/* LEFT PANEL - Avatar area */}
            <div className="relative bg-gradient-to-b from-[#CFE2FF] via-[#8FB2E6] to-[#2C5A93] p-10 flex items-center justify-center">
              {isLoading ? (
                <div className="h-40 w-40 rounded-full ring-4 ring-white/80 bg-gray-300 animate-pulse" />
              ) : (
                <div className="relative h-40 w-40 rounded-full ring-4 ring-white/80 overflow-hidden bg-white">
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            {/* RIGHT CONTENT */}
            <div className="p-6 sm:p-10">
              {isLoading ? (
                <>
                  <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
                  <div className="mt-2 h-5 w-48 bg-gray-200 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#0B1C39]">
                    {agent.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-sm text-[#8A8A8A]">
                    <Building2 className="h-4 w-4" />
                    <span>{agent.company}</span>
                  </div>
                </>
              )}

              {/* Info boxes */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-[#EFF2F6] px-5 py-4">
                  <p className="text-sm text-[#7D7D7D]">Specialty</p>
                  {isLoading ? (
                    <div className="mt-2 h-6 w-32 bg-gray-300 rounded animate-pulse" />
                  ) : (
                    <p className="mt-1 text-base font-semibold text-[#051E3C]">
                      {agent.specialty}
                    </p>
                  )}
                </div>

                <div className="rounded-xl bg-[#EFF2F6] px-5 py-4">
                  <p className="text-sm text-[#7D7D7D]">
                    {isLoading ? "Active Listings" : agent.activeLabel}
                  </p>
                  {isLoading ? (
                    <div className="mt-2 h-6 w-16 bg-gray-300 rounded animate-pulse" />
                  ) : (
                    <p className="mt-1 text-base font-semibold text-[#051E3C]">
                      {agent.activeCount}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact details */}
              <div className="mt-6 space-y-3 text-base text-[#7D7D7D]">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#0B1C39]" />
                  {isLoading ? (
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <span>{agent.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#0B1C39]" />
                  {isLoading ? (
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <span>{agent.email}</span>
                  )}
                </div>
              </div>

              {/* Button */}
              <Button
                asChild={!isLoading && !!whatsappLink}
                disabled={isLoading || !whatsappLink}
                className="mt-7 h-11 px-8 rounded-md bg-[#061F3D] hover:bg-[#061F3D]/90 text-white disabled:opacity-50"
              >
                {isLoading ? (
                  "Loading..."
                ) : whatsappLink ? (
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    Contact Agent
                  </a>
                ) : (
                  "Contact Agent"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
