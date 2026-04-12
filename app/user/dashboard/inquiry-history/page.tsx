


"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock3,
  Eye,
  CircleCheck,
  MessageSquare,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type InquiryStatus = "Responded" | "Pending" | "Viewed" | "Closed";

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  slug?: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface Message {
  senderId: string;
  senderRole: string;
  message: string;
}

interface Lead {
  _id: string;
  userId: User;
  propertyId: Property;
  propertyOwnerId: User;
  status: string;
  isClosed: boolean;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

type StatusCardProps = {
  count: number;
  label: string;
  icon: React.ReactNode;
};

type InquiryCardProps = {
  item: Lead;
  onClick?: () => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function mapApiStatusToUI(status: string, isClosed: boolean): InquiryStatus {
  if (isClosed) return "Closed";
  const lower = status.toLowerCase();
  if (lower === "responded") return "Responded";
  if (lower === "pending") return "Pending";
  return "Viewed"; // fallback — adjust based on your real statuses
}

function getStatusStyles(status: InquiryStatus) {
  switch (status) {
    case "Responded":
      return {
        badge: "bg-[#EAFBF1] text-[#55C28A]",
        iconWrap: "text-[#0B2341]",
        icon: <CircleCheck className="h-4 w-4" />,
      };
    case "Pending":
      return {
        badge: "bg-[#FBF4E3] text-[#C8A343]",
        iconWrap: "text-[#B8860B]",
        icon: <Clock3 className="h-4 w-4" />,
      };
    case "Viewed":
      return {
        badge: "bg-[#EEF4FF] text-[#6F8DFF]",
        iconWrap: "text-[#4F7BFF]",
        icon: <Eye className="h-4 w-4" />,
      };
    case "Closed":
      return {
        badge: "bg-gray-200 text-gray-700",
        iconWrap: "text-gray-600",
        icon: <X className="h-4 w-4" />,
      };
    default:
      return {
        badge: "bg-slate-100 text-slate-600",
        iconWrap: "text-slate-600",
        icon: <CircleCheck className="h-4 w-4" />,
      };
  }
}

function StatusCard({ count, label, icon }: StatusCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#ECECEC] shadow-[0_4px_14px_rgba(15,23,42,0.06)] px-4 py-5 sm:px-5 sm:py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[28px] sm:text-[32px] leading-none font-bold text-[#0B2341]">
            {count}
          </h3>
          <p className="mt-2 text-[13px] sm:text-[14px] text-[#5E6773]">
            {label}
          </p>
        </div>
        <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#F3FAFF] text-[#0B2341]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InquiryCardSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-white border border-[#ECECEC] shadow-[0_4px_14px_rgba(15,23,42,0.06)] px-4 py-4 sm:px-5 sm:py-5 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="mt-2 h-4 w-4 rounded-full bg-gray-200" />
            <div className="min-w-0 flex-1">
              <div className="h-6 w-3/4 bg-gray-200 rounded" />
              <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="mt-4 h-12 bg-gray-200 rounded" />
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function InquiryCard({ item, onClick }: InquiryCardProps) {
  const status = mapApiStatusToUI(item.status, item.isClosed);
  const styles = getStatusStyles(status);

  const firstMessage = item.messages?.[0]?.message || "No message available";
  const agentName = `${item.propertyOwnerId.firstName} ${item.propertyOwnerId.lastName}`;
  const date = new Date(item.createdAt).toLocaleDateString("en-GB");

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl bg-white border border-[#ECECEC] text-left shadow-[0_4px_14px_rgba(15,23,42,0.06)] px-4 py-4 sm:px-5 sm:py-5 transition hover:border-[#D8DDE3]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <span className={cn("mt-2 shrink-0", styles.iconWrap)}>
              {styles.icon}
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-[18px] sm:text-[20px] font-medium text-[#3E4650]">
                {item?.propertyId?.title}
              </h3>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#9A9FA8]">
                {item?.propertyId?.location}
              </p>
            </div>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-[11px] sm:text-[12px] font-medium",
            styles.badge
          )}
        >
          {status}
        </span>
      </div>
      <p className="mt-4 text-[13px] sm:text-[14px] leading-6 text-[#5F6874] line-clamp-3">
        {firstMessage}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-[12px] sm:text-[13px] text-[#8A9099] truncate">
          Agent: {agentName}
        </p>
        <p className="shrink-0 text-[12px] sm:text-[13px] text-[#9A9FA8]">
          {date}
        </p>
      </div>
    </button>
  );
}

export default function MyLeadsDashboard() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<Lead[]>({
    queryKey: ["my-leads"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/contact-property/my-inquiry`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status}`);
      }

      const json = await response.json();

      // Adjust according to your actual response shape
      if (!json.success || !Array.isArray(json.data)) {
        throw new Error("Invalid response format");
      }

      return json.data as Lead[];
    },
  });

  const leads = data || [];

  // Compute stats
  const responded = leads.filter((l) => l.status.toLowerCase() === "responded").length;
  const pending = leads.filter((l) => l.status.toLowerCase() === "pending" && !l.isClosed).length;
  const viewed = leads.filter(
    (l) =>
      !l.isClosed &&
      l.status.toLowerCase() !== "pending" &&
      l.status.toLowerCase() !== "responded"
  ).length;

  const stats = [
    { count: responded, label: "Responded", icon: <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" /> },
    { count: pending, label: "Pending", icon: <Clock3 className="h-5 w-5 sm:h-6 sm:w-6" /> },
    { count: viewed, label: "Viewed", icon: <Eye className="h-5 w-5 sm:h-6 sm:w-6" /> },
  ];

  return (
    <section className="w-full bg-[#F8F8F8]">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <StatusCard key={item.label} count={item.count} label={item.label} icon={item.icon} />
          ))}
        </div>

        {/* Leads / Skeleton */}
        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {isLoading ? (
            <>
              <InquiryCardSkeleton />
              <InquiryCardSkeleton />
              <InquiryCardSkeleton />
            </>
          ) : isError ? (
            <div className="col-span-full text-center py-12 text-red-600">
              Failed to load leads: {error instanceof Error ? error.message : "Unknown error"}
            </div>
          ) : leads.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No leads found at the moment.
            </div>
          ) : (
            leads.map((item) => (
              <InquiryCard
                key={item._id}
                item={item}
                onClick={() => setSelectedLead(item)}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-[680px] rounded-2xl bg-white shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
            <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#061F3D]">
                  {selectedLead?.propertyId?.title}
                </h2>
                <p className="mt-1 text-[#4A5565]">{selectedLead?.propertyId?.location}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-full p-1 text-[#98A2B3] hover:bg-[#F2F4F7]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-t border-[#EEF2F6] px-5 py-6 sm:px-6">
              <div className="flex items-center gap-2 text-[#1F2A37]">
                <MessageSquare className="h-5 w-5" />
                <h3 className="text-[18px] font-semibold">Your Inquiry</h3>
              </div>
              <div className="mt-3 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                <p className="text-[14px] leading-6 text-[#374151]">
                  {selectedLead.messages?.find((m) => m.senderRole === "user")?.message ||
                    "No message"}
                </p>
                <p className="mt-3 text-[12px] text-[#9AA3AF]">
                  Sent on {new Date(selectedLead.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>

            <div className="border-t border-[#EEF2F6] px-5 py-6 sm:px-6">
              <div className="flex items-center gap-2 text-[#1F2A37]">
                <CircleCheck className="h-5 w-5 text-[#0B2239]" />
                <h3 className="text-[18px] font-semibold">Agent Response</h3>
              </div>
              <div className="mt-3 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                <p className="text-[14px] leading-6 text-[#374151]">
                  {selectedLead.messages?.find((m) => m.senderRole === "agent")?.message ||
                    "No response yet."}
                </p>
                <div className="mt-3 flex items-center justify-between text-[12px] text-[#9AA3AF]">
                  <span>
                    - {selectedLead.propertyOwnerId.firstName} {selectedLead.propertyOwnerId.lastName}
                  </span>
                  <span>{new Date(selectedLead.updatedAt).toLocaleDateString("en-GB")}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EEF2F6] px-5 py-5 sm:px-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const slugOrId = selectedLead?.propertyId?.slug ?? selectedLead?.propertyId?._id;
                    router.push(`/property-buy/${slugOrId}`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-[#061F3D] bg-white px-5 py-3 text-[15px] font-medium text-[#061F3D] hover:bg-[#F8FAFC]"
                >
                  <Eye className="h-5 w-5" />
                  View Property
                </button>
               
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
