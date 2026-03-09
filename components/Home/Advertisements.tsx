

"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

// ────────// Types───────────────
interface Advertisement {
  _id: string;
  companyName: string;
  advertisementType: "Banner" | "Video" | string;
  callToActionURL: string;
  uploadMedia: string;
  targetRegions: string[];
  targetAudience: string[];
  compaingBudget?: number;
  compaingDuration?: string;
  campaignBudget?: number;
  campaignDuration?: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
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

// ─Skeleton Card───────────────
function AdvertisementSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl border border-gray-200">
        <div className="rounded-xl bg-white p-2">
          <div className="relative h-[430px] w-full overflow-hidden rounded-[4px] bg-gray-200" />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="h-8 w-3/4 rounded bg-gray-200" />
        <div className="h-5 w-1/3 rounded bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-5 w-16 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

async function fetchAdvertisements(): Promise<Advertisement[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisement`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch advertisements: ${res.status}`);
  }

  const json: ApiResponse = await res.json();

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Invalid API response format");
  }

  return json.data;
}

// ───────Main Component─────────────────────────────────────────
export function Advertisements() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["advertisements"],
    queryFn: fetchAdvertisements,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const isPaid = (ad: Advertisement) =>
    ad.paymentStatus?.toLowerCase() === "paid";

  const isVideoAd = (ad: Advertisement) => {
    const type = ad.advertisementType?.toLowerCase() || "";
    const media = ad.uploadMedia || "";
    return (
      type === "video" ||
      /\.(mp4|webm|ogg)(\?|#|$)/i.test(media)
    );
  };

  const ads = data ?? [];
  const paidAds = ads.filter(isPaid);
  // Prefer paid ads when available, otherwise show any to avoid an empty section.
  const visibleAds = paidAds.length > 0 ? paidAds : ads;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
            Our <span className="text-[#D3920E]">Advertisements</span>
          </h2>
          <p className="mt-2 text-sm md:text-base text-[#8A8A8A] max-w-xl">
            Experience the easiest, safest, and most transparent way to find properties in Kenya
          </p>
        </div>

        {/* Content / Loading / Error */}
        {error ? (
          <div className="text-center text-red-600 py-12">
            Failed to load advertisements
          </div>
        ) : isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <AdvertisementSkeleton key={i} />
            ))}
          </div>
        ) : visibleAds.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No active advertisements at the moment
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleAds.map((ad) => {
              const duration = ad.compaingDuration || ad.campaignDuration || "—";
              const hasMedia = Boolean(ad.uploadMedia);
              const isVideo = isVideoAd(ad);

              return (
              <div key={ad._id} className="group">
                {/* Blue frame container – you can add border-blue-600 if needed */}
                <div className="rounded-2xl">
                  <div className="rounded-xl bg-white p-2 shadow-sm">
                    <div className="relative h-[430px] w-full overflow-hidden rounded-[4px] bg-[#F4F6F8]">
                      {!hasMedia ? (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          No media
                        </div>
                      ) : isVideo ? (
                        <video
                          src={ad.uploadMedia}
                          className="h-full w-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={ad.uploadMedia}
                          alt={`${ad.companyName} advertisement`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          unoptimized
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer text – outside the frame */}
                <div className="mt-4 space-y-3 px-1">
                  <p className="text-2xl font-semibold text-[#05203D] line-clamp-2">
                    {ad.companyName}
                  </p>
                  <p className="text-base text-[#ACACAC]">
                    {ad.advertisementType} • {duration}
                  </p>
                  {/* Views – you don't have views in API, so either remove or add later */}
                  {/* <div className="flex items-center gap-2 text-base text-[#68706A]">
                    <Eye className="h-4 w-4" />
                    <span>—</span>
                  </div> */}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
