/*eslint-disable  */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, Share2, MapPin, BedDouble, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton"; 
import EmailModal from "@/app/(website)/serach-result/_components/EmailModal";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// ────────TYPES─────────────────────────────
interface Property {
  _id: string;
  title: string;
  listingType: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  plot: number;
  description: string;
  location: string;
  price: number;
  images: string[];
  status: string;
  createdAt: string;
  bookmarkUser?: Array<string | { _id?: string }>;
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
  data: Property[];
}

interface Agent {
  _id?: string;
  firstName?: string;
  lastName?: string;
  role?: "agent" | "vendor" | string;
  phoneNumber?: string;
}

interface Advertisement {
  _id: string;
  companyName: string;
  advertisementType: string;
  callToActionURL?: string;
  uploadMedia?: string;
  targetRegions?: string[];
  targetAudience?: string[];
  compaingBudget?: number;
  compaingDuration?: string;
  campaignBudget?: number;
  campaignDuration?: string;
  startDate?: string;
  endDate?: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdvertisementApiResponse {
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

// ────────── API FETCHER────────────────────────────────────────
const fetchAgentProperties = async (agentId: string): Promise<Property[]> => {
  const response = await axios.get<ApiResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/property/agent/${agentId}?status=approved`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch properties");
  }

  return response.data.data;
};

const fetchAgent = async (agentId: string): Promise<Agent> => {
  const response = await axios.get<{ data?: Agent }>(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${agentId}`
  );
  return response.data?.data ?? {};
};

const fetchVendorAdvertisements = async (
  vendorId: string
): Promise<Advertisement[]> => {
  const response = await axios.get<AdvertisementApiResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/advertisement/vendor/${vendorId}`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to fetch vendor advertisements"
    );
  }

  return response.data.data ?? [];
};

// ─────SKELETON ROW─────────────────────────────────────────────
function ListingRowSkeleton() {
  return (
    <div className="rounded-xl border border-[#EDEDED] bg-white overflow-hidden">
      <div className="grid md:grid-cols-[290px_1fr]">
        {/* Image skeleton */}
        <Skeleton className="h-[220px] md:h-full w-full rounded-none" />

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="flex gap-6">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>

          <Skeleton className="h-5 w-3/4" />

          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────SINGLE LISTING ROW────────────────────────────────────
const formatPrice = (price: number) => `KSh ${(price / 1_000_000).toFixed(1)}M`;

function ListingRow({
  property,
  isBookmarked,
  isBookmarkLoading,
  onBookmarkToggle,
  onShareClick,
  onEmailClick,
  onWhatsAppClick,
}: {
  property: Property;
  isBookmarked: boolean;
  isBookmarkLoading: boolean;
  onBookmarkToggle: (property: Property) => void;
  onShareClick: (property: Property) => void;
  onEmailClick: (listing: Property) => void;
  onWhatsAppClick: () => void;
}) {
  const mainImage = property.images[0] || "/placeholder-property.jpg";
  const priceFormatted = formatPrice(property.price);

  return (
    <div className="rounded-xl border border-[#EDEDED] bg-white overflow-hidden hover:shadow-sm transition-shadow">
      <div className="grid md:grid-cols-[290px_1fr]">
        {/* Image */}
        <div className="relative h-full w-full aspect-[4/3] md:aspect-auto">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 290px"
            priority={false}
          />

          {/* You can add "For Sale" / "For Rent" badge here if desired */}
          <span className="absolute left-3 top-3 rounded-full bg-[#0B1C39] px-3 py-1 text-[11px] font-semibold text-white">
            {property.listingType}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Price + actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-2xl font-semibold text-[#1E1E1E]">
                {priceFormatted}
              </p>
              <div className="mt-1 flex items-center gap-2 text-base text-[#7D7D7D]">
                <MapPin className="h-3.5 w-3.5" />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#6F6F6F]">
              <button
                className="inline-flex items-center gap-2 hover:text-[#0B1C39] transition"
                type="button"
                onClick={() => onShareClick(property)}
              >
                <Share2 className="h-4 w-4" />
                Share 
              </button>
              <button
                className="inline-flex items-center gap-2 hover:text-[#0B1C39] transition disabled:opacity-60 disabled:cursor-not-allowed"
                type="button"
                onClick={() => onBookmarkToggle(property)}
                disabled={isBookmarkLoading}
                aria-pressed={isBookmarked}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Heart
                  className={`h-4 w-4 ${isBookmarked ? "text-red-500" : ""}`}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
                {isBookmarked ? "Favorite" : "Favorite"}
              </button>
            </div>
          </div>

          {/* Property pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill active>
              <span className="h-2 w-2 rounded-full bg-[#0B1C39]" />
              Approved
            </Pill>
            <Pill>
              <BedDouble className="h-3.5 w-3.5" />
              {property.bedrooms} Beds
            </Pill>
            <Pill>
              <Bath className="h-3.5 w-3.5" />
              {property.bathrooms} Baths
            </Pill>
            <Pill>
              <Square className="h-3.5 w-3.5" />
              Built-up: {property.area} sqft
            </Pill>
            {property.plot > 0 && (
              <Pill>
                <Square className="h-3.5 w-3.5" />
                Plot: {property.plot} sqft
              </Pill>
            )}
          </div>

          {/* Title / Tagline */}
          <p className="mt-3 text-sm sm:text-base font-medium text-[#1E1E1E] line-clamp-2">
            {property.title}
          </p>

          {/* Actions */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="h-10 rounded-md border-[#0B1C39]/30 text-[#0B1C39] hover:bg-[#0B1C39]/5"
              onClick={() => onEmailClick(property)}
            >
              Email
            </Button>

            <Button
              type="button"
              onClick={onWhatsAppClick}
              className="h-10 rounded-md bg-[#061F3D] hover:bg-[#061F3D]/90 text-white"
            >
              <span className="inline-flex items-center gap-2">
                <Image
                  src="/WhatsApp.png"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                WhatsApp
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────PILL COMPONENT (unchanged)────────────────────────────
function Pill({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border bg-white px-3 py-1 text-[11px] text-[#6F6F6F] ${
        active
          ? "border-[#0B1C39]/30 text-[#0B1C39]"
          : "border-[#E6E6E6]"
      }`}
    >
      {children}
    </span>
  );
}

// ──────ADVERTISEMENT CARD────────────────────────────────────
const isVideoAd = (ad: Advertisement) => {
  const type = ad.advertisementType?.toLowerCase() || "";
  const media = ad.uploadMedia || "";
  return type === "video" || /\.(mp4|webm|ogg)(\?|#|$)/i.test(media);
};

function AdvertisementCard({ ad }: { ad: Advertisement }) {
  const duration = ad.compaingDuration || ad.campaignDuration || "—";
  const hasMedia = Boolean(ad.uploadMedia);
  const isVideo = isVideoAd(ad);

  return (
    <div className="rounded-xl border border-[#EDEDED] bg-white overflow-hidden">
      <div className="relative h-[220px] w-full bg-[#F4F6F8]">
        {!hasMedia ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
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
            src={ad.uploadMedia as string}
            alt={`${ad.companyName} advertisement`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        )}
      </div>

      <div className="p-4">
        <p className="text-lg font-semibold text-[#1E1E1E] line-clamp-1">
          {ad.companyName}
        </p>
        <p className="mt-1 text-sm text-[#7D7D7D]">
          {ad.advertisementType} • {duration}
        </p>

        {ad.targetRegions && ad.targetRegions.length > 0 && (
          <p className="mt-2 text-xs text-[#7D7D7D] line-clamp-1">
            Regions: {ad.targetRegions.join(", ")}
          </p>
        )}

        {/* {ad.callToActionURL ? (
          <Button
            asChild
            className="mt-4 h-9 rounded-md bg-[#061F3D] hover:bg-[#061F3D]/90 text-white"
          >
            <a href={ad.callToActionURL} target="_blank" rel="noreferrer">
              Visit
            </a>
          </Button>
        ) : null} */}
      </div>
    </div>
  );
}

function AdvertisementCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#EDEDED] bg-white overflow-hidden">
      <Skeleton className="h-[220px] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

// ──────────────MAIN COMPONENT────────────────────────────────────────
export default function AgentListingsSection() {
  const params = useParams();
  const agentId = params.id as string; 
  const [emailOpen, setEmailOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Property | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?._id as string | undefined;
  const queryClient = useQueryClient();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState<string | null>(null);

  const {
    data: properties = [],
    isLoading: isPropertiesLoading,
    isError,
    error,
  } = useQuery<Property[], Error>({
    queryKey: ["agent-properties", agentId],
    queryFn: () => fetchAgentProperties(agentId),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, 
  });

  const { data: agentData, isLoading: isAgentLoading } = useQuery<Agent, Error>({
    queryKey: ["agent", agentId],
    queryFn: () => fetchAgent(agentId),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });

  const isVendor = agentData?.role === "vendor";

  const {
    data: advertisements = [],
    isLoading: isAdvertisementsLoading,
    isError: isAdvertisementsError,
    error: advertisementsError,
  } = useQuery<Advertisement[], Error>({
    queryKey: ["vendor-advertisements", agentId],
    queryFn: () => fetchVendorAdvertisements(agentId),
    enabled: !!agentId && isVendor,
    staleTime: 5 * 60 * 1000,
  });

  const agentPhone = agentData?.phoneNumber;

  const displayName = [agentData?.firstName, agentData?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const fallbackLabel = isVendor ? "Vendor" : "Agent";
  const title = isVendor
    ? `${displayName || fallbackLabel} Advertisements (${advertisements.length})`
    : `${displayName || fallbackLabel} Listings (${properties.length})`;

  useEffect(() => {
    if (!properties || !userId) {
      setBookmarkedIds(new Set());
      return;
    }

    const initial = new Set<string>();
    properties.forEach((property) => {
      const bookmarks = property.bookmarkUser ?? [];
      const hasBookmark = bookmarks.some((entry) => {
        if (typeof entry === "string") return entry === userId;
        if (entry && typeof entry === "object") {
          return entry._id === userId;
        }
        return false;
      });
      if (hasBookmark) initial.add(property._id);
    });

    setBookmarkedIds(initial);
  }, [properties, userId]);
  const openEmailModal = (listing: Property) => {
    if (!userId) {
      toast.error("Please login to email the agent.");
      return;
    }

    setSelectedListing(listing);
    setEmailOpen(true);
  };

  const handleWhatsAppClick = () => {
    if (!userId) {
      toast.error("Please login to message on WhatsApp.");
      return;
    }

    const whatsappLink = buildWhatsAppLink(agentPhone);

    if (!whatsappLink) {
      toast.error("Not available on WhatsApp");
      return;
    }

    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  const handleShareClick = async (property: Property) => {
    if (!property?._id) return;

    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/property-buy/${property._id}`
        : "";

    if (!url) {
      toast.error("Unable to generate share link.");
      return;
    }

    const title = property.title || "Property listing";
    const textParts = [
      property.title,
      property.location,
      property.price ? formatPrice(property.price) : "",
    ].filter(Boolean);
    const text = textParts.join(" • ");

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        toast.success("Link shared.");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        // fall through to clipboard as backup
      }
    }

   
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied.");
        return;
      }
    

    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Link copied.");
    } catch (error) {
      toast.error("Failed to share link."+ error);
    }
  };

  const bookmarkMutation = useMutation<
    void,
    Error,
    { propertyId: string; action: "add" | "remove" },
    { propertyId: string; action: "add" | "remove" }
  >({
    mutationFn: async ({ propertyId, action }) => {
      if (action === "add") {
        await api.post(`/bookmark/${propertyId}`);
        return;
      }
      await api.delete(`/bookmark/${propertyId}`);
    },
    onMutate: async ({ propertyId, action }) => {
      setBookmarkLoadingId(propertyId);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (action === "add") {
          next.add(propertyId);
        } else {
          next.delete(propertyId);
        }
        return next;
      });
      return { propertyId, action };
    },
    onError: (error, variables, context) => {
      const message = error?.message || "Failed to update bookmark.";
      toast.error(message);
      if (context) {
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          if (context.action === "add") {
            next.delete(context.propertyId);
          } else {
            next.add(context.propertyId);
          }
          return next;
        });
      }
    },
    onSuccess: (_data, variables) => {
      toast.success(
        variables.action === "add" ? "Property bookmarked." : "Bookmark removed."
      );
    },
    onSettled: (_data, _error, _variables) => {
      setBookmarkLoadingId(null);
      queryClient.invalidateQueries({ queryKey: ["agent-properties", agentId] });
    },
  });

  const handleBookmarkToggle = (property: Property) => {
    if (!property?._id) return;
    if (!userId) {
      toast.error("Please login to bookmark properties.");
      return;
    }

    const isBookmarked = bookmarkedIds.has(property._id);
    bookmarkMutation.mutate({
      propertyId: property._id,
      action: isBookmarked ? "remove" : "add",
    });
  };

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-xl sm:text-4xl font-bold text-[#061F3D]">
          {isAgentLoading ? <Skeleton className="h-10 w-64" /> : title}
        </h2>

        {/* Listings / Skeletons */}
        <div className="mt-6 space-y-4">
          {isVendor ? (
            isAdvertisementsLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <AdvertisementCardSkeleton key={`ad-skel-${i}`} />
                ))}
              </div>
            ) : isAdvertisementsError ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p className="font-medium">Failed to load advertisements</p>
                <p className="text-sm mt-1">
                  {advertisementsError?.message || "Unknown error"}
                </p>
              </div>
            ) : advertisements.length === 0 ? (
              <div className="p-10 text-center text-gray-500 border border-dashed rounded-lg">
                No advertisements found for this vendor.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {advertisements.map((ad) => (
                  <AdvertisementCard key={ad._id} ad={ad} />
                ))}
              </div>
            )
          ) : isPropertiesLoading ? (
            <>
              <ListingRowSkeleton />
              <ListingRowSkeleton />
              <ListingRowSkeleton />
            </>
          ) : isError ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-medium">Failed to load listings</p>
              <p className="text-sm mt-1">{error?.message || "Unknown error"}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="p-10 text-center text-gray-500 border border-dashed rounded-lg">
              No approved properties found for this agent.
            </div>
          ) : (
            properties.map((property) => (
              <ListingRow
                key={property._id}
                property={property}
                isBookmarked={bookmarkedIds.has(property._id)}
                isBookmarkLoading={bookmarkLoadingId === property._id}
                onBookmarkToggle={handleBookmarkToggle}
                onShareClick={handleShareClick}
                onEmailClick={openEmailModal}
                onWhatsAppClick={handleWhatsAppClick}
              />
            ))
          )}
        </div>
      </div>

      <EmailModal
        open={emailOpen}
        onOpenChange={setEmailOpen}
        listing={
          selectedListing
            ? {
                id: selectedListing._id,
                price: formatPrice(selectedListing.price),
                location: selectedListing.location,
                title: selectedListing.title,
              }
            : null
        }
      />
    </section>
  );
}
