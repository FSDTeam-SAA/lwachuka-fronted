// "use client";

// import { useState } from "react";
// import {
//   CheckCircle2,
//   Clock3,
//   Eye,
//   CircleCheck,
//   MessageSquare,
//   X,
//   Send,
// } from "lucide-react";

// type InquiryStatus = "Responded" | "Pending" | "Viewed";

// type InquiryItem = {
//   id: number;
//   title: string;
//   location: string;
//   message: string;
//   agent: string;
//   date: string;
//   status: InquiryStatus;
//   response?: string;
//   responseDate?: string;
// };

// type StatusCardProps = {
//   count: number;
//   label: string;
//   icon: React.ReactNode;
// };

// type InquiryCardProps = {
//   item: InquiryItem;
//   onClick?: () => void;
// };

// function cn(...classes: Array<string | false | null | undefined>) {
//   return classes.filter(Boolean).join(" ");
// }

// function getStatusStyles(status: InquiryStatus) {
//   switch (status) {
//     case "Responded":
//       return {
//         badge: "bg-[#EAFBF1] text-[#55C28A]",
//         iconWrap: "text-[#0B2341]",
//         icon: <CircleCheck className="h-4 w-4" />,
//       };
//     case "Pending":
//       return {
//         badge: "bg-[#FBF4E3] text-[#C8A343]",
//         iconWrap: "text-[#B8860B]",
//         icon: <Clock3 className="h-4 w-4" />,
//       };
//     case "Viewed":
//       return {
//         badge: "bg-[#EEF4FF] text-[#6F8DFF]",
//         iconWrap: "text-[#4F7BFF]",
//         icon: <Eye className="h-4 w-4" />,
//       };
//     default:
//       return {
//         badge: "bg-slate-100 text-slate-600",
//         iconWrap: "text-slate-600",
//         icon: <CircleCheck className="h-4 w-4" />,
//       };
//   }
// }

// function StatusCard({ count, label, icon }: StatusCardProps) {
//   return (
//     <div className="rounded-2xl bg-white border border-[#ECECEC] shadow-[0_4px_14px_rgba(15,23,42,0.06)] px-4 py-5 sm:px-5 sm:py-6">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h3 className="text-[28px] sm:text-[32px] leading-none font-bold text-[#0B2341]">
//             {count}
//           </h3>
//           <p className="mt-2 text-[13px] sm:text-[14px] text-[#5E6773]">
//             {label}
//           </p>
//         </div>

//         <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#F3FAFF] text-[#0B2341]">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function InquiryCard({ item, onClick }: InquiryCardProps) {
//   const styles = getStatusStyles(item.status);

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className="w-full rounded-2xl bg-white border border-[#ECECEC] text-left shadow-[0_4px_14px_rgba(15,23,42,0.06)] px-4 py-4 sm:px-5 sm:py-5 transition hover:border-[#D8DDE3]"
//     >
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0 flex-1">
//           <div className="flex items-start gap-2">
//             <span className={cn("mt-2 shrink-0", styles.iconWrap)}>
//               {styles.icon}
//             </span>

//             <div className="min-w-0">
//               <h3 className="truncate text-[18px] sm:text-[20px] font-medium text-[#3E4650]">
//                 {item.title}
//               </h3>
//               <p className="mt-1 text-[13px] sm:text-[14px] text-[#9A9FA8]">
//                 {item.location}
//               </p>
//             </div>
//           </div>
//         </div>

//         <span
//           className={cn(
//             "shrink-0 rounded-full px-3 py-1 text-[11px] sm:text-[12px] font-medium",
//             styles.badge
//           )}
//         >
//           {item.status}
//         </span>
//       </div>

//       <p className="mt-4 text-[13px] sm:text-[14px] leading-6 text-[#5F6874]">
//         {item.message}
//       </p>

//       <div className="mt-4 flex items-center justify-between gap-3">
//         <p className="text-[12px] sm:text-[13px] text-[#8A9099] truncate">
//           Agent: {item.agent}
//         </p>
//         <p className="shrink-0 text-[12px] sm:text-[13px] text-[#9A9FA8]">
//           {item.date}
//         </p>
//       </div>
//     </button>
//   );
// }

// export default function InquiryDashboardClone() {
//   const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

//   const stats = [
//     {
//       count: 4,
//       label: "Responded",
//       icon: <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />,
//     },
//     {
//       count: 2,
//       label: "Pending",
//       icon: <Clock3 className="h-5 w-5 sm:h-6 sm:w-6" />,
//     },
//     {
//       count: 2,
//       label: "Viewed",
//       icon: <Eye className="h-5 w-5 sm:h-6 sm:w-6" />,
//     },
//   ];

//   const inquiries: InquiryItem[] = [
//     {
//       id: 1,
//       title: "3 Bedroom Apartment in Kilimani",
//       location: "Kilimani, Nairobi",
//       message:
//         "Hi, I'm interested in viewing this property. Is it still available? What are the move-in requirements?",
//       agent: "Sarah Mwangi",
//       date: "2/6/2024",
//       status: "Responded",
//       response:
//         "Hello! Yes, the property is still available. You can schedule a viewing this week. Move-in requires 2 months deposit and 1 month rent.",
//       responseDate: "2/6/2024",
//     },
//     {
//       id: 2,
//       title: "4 Bedroom Villa in Karen",
//       location: "Kilimani, Nairobi",
//       message:
//         "I would like more information about the amenities and security features of this villa.",
//       agent: "David Ochieng",
//       date: "2/6/2024",
//       status: "Responded",
//       response:
//         "The villa has 24/7 security, CCTV coverage, backup generator, and a private garden. We can share a detailed amenities list if needed.",
//       responseDate: "2/6/2024",
//     },
//     {
//       id: 3,
//       title: "3 Bedroom Apartment in Kilimani",
//       location: "Kilimani, Nairobi",
//       message:
//         "Hi, I'm interested in viewing this property. Is it still available? What are the move-in requirements?",
//       agent: "Sarah Mwangi",
//       date: "2/6/2024",
//       status: "Responded",
//       response:
//         "Yes, it is available. I can share available viewing slots for this week. Let me know your preferred day.",
//       responseDate: "2/6/2024",
//     },
//     {
//       id: 4,
//       title: "4 Bedroom Villa in Karen",
//       location: "Kilimani, Nairobi",
//       message:
//         "I would like more information about the amenities and security features of this villa.",
//       agent: "David Ochieng",
//       date: "2/6/2024",
//       status: "Responded",
//       response:
//         "The villa includes a modern gym, heated pool, and covered parking. Security includes gated access and guards.",
//       responseDate: "2/6/2024",
//     },
//     {
//       id: 5,
//       title: "Penthouse in Westlands",
//       location: "Westlands, Nairobi",
//       message:
//         "Is the penthouse furnished? What utilities are included in the rent?",
//       agent: "Grace Kamau",
//       date: "2/6/2024",
//       status: "Pending",
//     },
//     {
//       id: 6,
//       title: "2 Bedroom Townhouse in Lavington",
//       location: "Kilimani, Nairobi",
//       message:
//         "I would like more information about the amenities and security features of this villa.",
//       agent: "David Ochieng",
//       date: "2/6/2024",
//       status: "Viewed",
//     },
//     {
//       id: 7,
//       title: "3 Bedroom Apartment in Kilimani",
//       location: "Kilimani, Nairobi",
//       message:
//         "Hi, I'm interested in viewing this property. Is it still available? What are the move-in requirements?",
//       agent: "Sarah Mwangi",
//       date: "2/6/2024",
//       status: "Viewed",
//     },
//     {
//       id: 8,
//       title: "4 Bedroom Villa in Karen",
//       location: "Kilimani, Nairobi",
//       message:
//         "I would like more information about the amenities and security features of this villa.",
//       agent: "David Ochieng",
//       date: "2/6/2024",
//       status: "Pending",
//     },
//   ];

//   return (
//     <section className="w-full bg-[#F8F8F8]">
//       <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//         {/* Top stat cards */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
//           {stats.map((item) => (
//             <StatusCard
//               key={item.label}
//               count={item.count}
//               label={item.label}
//               icon={item.icon}
//             />
//           ))}
//         </div>

//         {/* Inquiry cards */}
//         <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
//           {inquiries.map((item) => (
//             <InquiryCard
//               key={item.id}
//               item={item}
//               onClick={() => setSelectedInquiry(item)}
//             />
//           ))}
//         </div>
//       </div>

//       {selectedInquiry && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
//           <div className="w-full max-w-[672px] rounded-2xl bg-white shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
//             <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
//               <div>
//                 <h2 className="text-[20px] sm:text-[18px] font-semibold text-[#061F3D]">
//                   {selectedInquiry.title}
//                 </h2>
//                 <p className="mt-1 text-[12px] sm:text-[16px] text-[#4A5565]">
//                   {selectedInquiry.location}
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setSelectedInquiry(null)}
//                 className="rounded-full p-1 text-[#98A2B3] transition hover:bg-[#F2F4F7]"
//                 aria-label="Close"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <div className="border-t border-[#EEF2F6] px-5 py-4 sm:px-6">
//               <div className="flex items-center gap-2 text-[#1F2A37]">
//                 <MessageSquare className="h-4 w-4" />
//                 <h3 className="text-[18px] font-semibold text-[#051E3C]">Your Inquiry</h3>
//               </div>

//               <div className="mt-3 rounded-xl border-2 border-[#E5E7EB]  bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
//                 <p className="text-[12px] sm:text-[16px] text-[#364153]">
//                   {selectedInquiry.message}
//                 </p>
//                 <p className="mt-2 text-[11px] text-[#A0A8B3]">
//                   Sent on {selectedInquiry.date}
//                 </p>
//               </div>
//             </div>

//             <div className="border-t border-[#EEF2F6] px-5 py-4 sm:px-6">
//               <div className="flex items-center gap-2 text-[#1F2A37]">
//                 <CheckCircle2 className="h-4 w-4" />
//                 <h3 className="text-[20px] font-semibold text-[#051E3C]">Agent Response</h3>
//               </div>

//               <div className="mt-3 rounded-xl border border-[#E8EDF2] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
//                 <p className="text-[12px] sm:text-[16px] text-[#364153]">
//                   {selectedInquiry.response ??
//                     "Awaiting response from the agent. We'll notify you as soon as they reply."}
//                 </p>
//                 <div className="mt-3 flex items-center justify-between text-[11px] text-[#A0A8B3]">
//                   <span>{selectedInquiry.response ? `- ${selectedInquiry.agent}` : ""}</span>
//                   <span>{selectedInquiry.responseDate ?? selectedInquiry.date}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-[#EEF2F6] px-5 py-4 sm:px-6">
//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <button
//                   type="button"
//                   className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#061F3D] bg-white px-4 py-2 text-[16px] font-medium text-[#1F2A37]"
//                 >
//                   <Eye className="h-4 w-4" />
//                   View Property
//                 </button>
//                 <button
//                   type="button"
//                   className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B2341] px-4 py-2 text-[16px] font-medium text-white"
//                 >
//                   <Send className="h-4 w-4" />
//                   Contact Agent
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }





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
  Send,
} from "lucide-react";

type InquiryStatus = "Responded" | "Pending" | "Viewed" | "Closed";

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  status: string;
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
                {item.propertyId.title}
              </h3>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#9A9FA8]">
                {item.propertyId.location}
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
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTZiZjRhNDA1Y2MxYThjNDU4YTM1ZiIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3Mjk2ODM4NSwiZXhwIjoxNzczNTczMTg1fQ.bZoc3EWCqSjA1abkwRIAf7Vo-MGltLo_kQxAEiUbS2o"

  const { data, isLoading, isError, error } = useQuery<Lead[]>({
    queryKey: ["my-leads"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact-property/my-leads`, {
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
          <div className="w-full max-w-[672px] rounded-2xl bg-white shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
            <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#061F3D]">
                  {selectedLead.propertyId.title}
                </h2>
                <p className="mt-1 text-[#4A5565]">{selectedLead.propertyId.location}</p>
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
              <div className="flex items-center gap-2 text-[#1F2A37] mb-3">
                <MessageSquare className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Your Message</h3>
              </div>
              <div className="rounded-xl border-2 border-[#E5E7EB] bg-white px-5 py-4">
                <p className="text-[#364153]">
                  {selectedLead.messages?.[0]?.message || "No message"}
                </p>
                <p className="mt-3 text-sm text-[#A0A8B3]">
                  Sent on {new Date(selectedLead.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>

            <div className="border-t border-[#EEF2F6] px-5 py-5 sm:px-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-[#061F3D] bg-white px-5 py-3 text-base font-medium">
                  <Eye className="h-5 w-5" />
                  View Property
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#0B2341] px-5 py-3 text-base font-medium text-white">
                  <Send className="h-5 w-5" />
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}