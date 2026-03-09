
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Eye,
  X,
  MapPin,
  Clock3,
  User,
  AlertCircle,
  Phone,
} from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";


type Booking = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  moveInData: string; // ISO date string
  phone: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  property: {
    _id: string;
    title: string;
    location: string;
    images: string[];
  } | null;
  createdAt: string;
  updatedAt: string;
};

type UpcomingVisit = {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  agent: string;
  contact: string;
  note: string;
  status: "Upcoming";
  raw: Booking;
};

type PastVisit = {
  id: string;
  title: string;
  location: string;
  date: string;
  status: "Completed" | "Cancelled";
};

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(iso: string): string {
  if (!iso) return "Invalid date";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Invalid date";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function isFuture(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return d > now;
}

// ────────────────────────────────────────────────
// Skeleton Card
// ────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#E9E9E9] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="h-6 w-3/4 rounded bg-gray-200" />
        <div className="h-5 w-20 rounded-full bg-gray-200" />
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-4/6 rounded bg-gray-200" />
        <div className="h-4 w-3/6 rounded bg-gray-200" />
      </div>
      <div className="mt-5 h-10 rounded-lg bg-gray-200" />
    </div>
  );
}

// ────────────────────────────────────────────────
// Stat Card
// ────────────────────────────────────────────────
function StatCard({
  value,
  label,
  icon,
  loading = false,
}: {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#E9E9E9] bg-white px-4 py-5 shadow-[0_4px_14px_rgba(15,23,42,0.06)] sm:px-5 sm:py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          {loading ? (
            <div className="h-9 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            <h3 className="text-[28px] font-bold leading-none text-[#0B2239] sm:text-[32px]">
              {value}
            </h3>
          )}
          <p className="mt-2 text-[12px] text-[#5E6773] sm:text-[13px]">
            {label}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3FAFF] text-[#0B2239] sm:h-11 sm:w-11">
          {icon}
        </div>
      </div>
    </div>
  );
}

function UpcomingVisitCard({
  item,
  onView,
}: {
  item: UpcomingVisit;
  onView: (visit: UpcomingVisit) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E9E9E9] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[16px] font-medium text-[#2E353A] sm:text-[18px]">
          {item.title}
        </h3>
        <span className="shrink-0 rounded-full bg-[#EAFBF1] px-3 py-1 text-[11px] font-medium text-[#55C28A]">
          {item.status}
        </span>
      </div>

      <div className="mt-4 space-y-2.5 text-[12px] text-[#8B8F97] sm:text-[13px]">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-[#8B8F97]" />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-[#8B8F97]" />
          <span>{item.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 text-[#8B8F97]" />
          <span>{item.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-[#8B8F97]" />
          <span>{item.agent}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#FBF4E7] px-3 py-3 text-[14px] font-medium text-[#D3920E]">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>Move-in: {item.date}</span>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => onView(item)}
          className="h-11 flex-1 rounded-lg border-2 border-[#061F3D] bg-white text-[14px] font-medium text-[#061F3D] hover:bg-slate-50"
        >
          View Details
        </button>
        <button
          type="button"
          className="cursor-not-allowed rounded-lg bg-[#E5533D] px-4 text-[13px] font-medium text-white opacity-50 h-11"
          disabled
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function PastVisitRow({ item }: { item: PastVisit }) {
  const color = item.status === "Completed" ? "#6F8DFF" : "#E5533D";
  const bg = item.status === "Completed" ? "#EEF4FF" : "#FFEBEB";

  return (
    <div className="rounded-xl border border-[#ECECEC] bg-white px-4 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.05)] sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[15px] font-medium text-[#2E353A] sm:text-[16px]">
              {item.title}
            </h4>
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-medium"
              style={{ backgroundColor: bg, color }}
            >
              {item.status}
            </span>
          </div>
          <p className="mt-2 text-[12px] text-[#9A9FA8] sm:text-[13px]">
            {item.location}
            <span className="mx-2">•</span>
            {item.date}
          </p>
        </div>
        <button
          type="button"
          className="text-left text-[12px] font-medium text-[#6E737B] hover:text-[#0B2239] sm:text-right"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
export default function MyBookings() {
  const { data: session, status } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<UpcomingVisit | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (status === "loading") return;

        const token = (session?.user as any)?.accessToken;

        if (!token) {
          setError("User token not found. Please login again.");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/calender/my-bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res?.data?.success && Array.isArray(res?.data?.data)) {
          setBookings(res.data.data);
        } else {
          setError("Invalid response format");
        }
      } catch (err: any) {
        console.error("Bookings API error:", err);
        setError(err?.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session, status]);

  const upcoming: UpcomingVisit[] = bookings
    .filter(
      (b) =>
        b?.property &&
        isFuture(b.moveInData) &&
        b.status?.toLowerCase() !== "cancelled"
    )
    .map((b) => ({
      id: b._id,
      title: b.property?.title || "Untitled Property",
      location: b.property?.location || "Location not available",
      date: formatDate(b.moveInData),
      time: "Not specified",
      agent: b.user
        ? `${b.user.firstName ?? ""} ${b.user.lastName ?? ""}`.trim() || "N/A"
        : "N/A",
      contact: b.phone || "N/A",
      note: `Requested by ${b.firstName || ""} ${b.lastName || ""}`.trim(),
      status: "Upcoming",
      raw: b,
    }));

  const past: PastVisit[] = bookings
    .filter(
      (b) =>
        b?.property &&
        !isFuture(b.moveInData || "") || b.status?.toLowerCase() === "cancelled"
    )
    .map((b) => ({
      id: b._id,
      title: b.property?.title || "Untitled Property",
      location: b.property?.location || "Location not available",
      date: formatDate(b.moveInData),
      status:
        b.status?.toLowerCase() === "cancelled" ? "Cancelled" : "Completed",
    }));

  const stats = [
    {
      value: upcoming.length,
      label: "Upcoming Visits",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      value: past.filter((p) => p.status === "Completed").length,
      label: "Completed",
      icon: <Eye className="h-5 w-5" />,
    },
    {
      value: past.filter((p) => p.status === "Cancelled").length,
      label: "Canceled",
      icon: <X className="h-5 w-5" />,
    },
  ];

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <section className="min-h-screen w-full bg-[#F8F8F8]">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <StatCard
              key={item.label}
              value={loading ? "•••" : item.value}
              label={item.label}
              icon={item.icon}
              loading={loading}
            />
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-[22px] font-medium text-[#2E353A] sm:text-[24px]">
            Upcoming Site Visits
          </h2>

          {loading ? (
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="mt-6 text-center text-gray-500">
              No upcoming visits found.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
              {upcoming.map((item) => (
                <UpcomingVisitCard
                  key={item.id}
                  item={item}
                  onView={setSelectedVisit}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-[22px] font-medium text-[#2E353A] sm:text-[24px]">
            Past Site Visits
          </h2>

          {loading ? (
            <div className="mt-4 space-y-4">
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : past.length === 0 ? (
            <p className="mt-6 text-center text-gray-500">No past visits yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {past.map((item) => (
                <PastVisitRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
            <div className="flex items-start justify-between gap-4 px-6 py-5">
              <div>
                <h2 className="text-[16px] font-semibold text-[#1F2A37]">
                  {selectedVisit.title}
                </h2>
                <span className="mt-2 inline-flex rounded-full bg-[#EAFBF1] px-2.5 py-1 text-[10px] font-medium text-[#55C28A]">
                  {selectedVisit.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedVisit(null)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-t px-6 py-5">
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-700">Location</div>
                    {selectedVisit.location}
                  </div>
                </div>
                <div className="flex gap-3">
                  <CalendarDays className="mt-1 h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-700">Move-in Date</div>
                    {selectedVisit.date}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock3 className="mt-1 h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-700">Time</div>
                    {selectedVisit.time}
                  </div>
                </div>
                <div className="flex gap-3">
                  <User className="mt-1 h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-700">Agent</div>
                    {selectedVisit.agent}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-1 h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-700">Contact</div>
                    {selectedVisit.contact}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border bg-gray-50 p-4">
                <div className="flex items-center gap-2 font-medium text-gray-700">
                  <AlertCircle className="h-4 w-4" />
                  Important Note
                </div>
                <p className="mt-2 text-gray-600">{selectedVisit.note}</p>
              </div>
            </div>

            <div className="flex gap-3 border-t px-6 py-5">
              <button className="flex-1 rounded-lg border border-gray-800 py-2.5 font-medium hover:bg-gray-50">
                View Property
              </button>
              <button
                className="flex-1 rounded-lg bg-red-500 py-2.5 font-medium text-white hover:bg-red-600"
                onClick={() => {
                  alert("Cancel not implemented yet");
                  setSelectedVisit(null);
                }}
              >
                Cancel Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}