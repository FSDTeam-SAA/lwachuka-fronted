/*eslint-disable  */
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Share2,
  Heart,
  Mail,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";
import EmailModal from "./_components/EmailModal";
import { SearchFilter } from "@/components/Home/SearchFilter";
import type { Property, PropertyApiResponse } from "@/types/PropertyType";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import api from "@/lib/api";


type TabKey = string;

type Listing = {
  id: string;
  price: string;
  location: string;
  title: string;
  image: string;
  tag: "Off-Plan" | "Ready";
  status: "Available" | "Sold";
  beds: number;
  baths: number;
  builtUp: string;
  plot: string;
  lat?: number;
  lng?: number;
  phoneNumber?: string;
};

declare global {
  interface Window {
    L?: {
      map: (el: HTMLElement, options?: Record<string, unknown>) => any;
      tileLayer: (url: string, options?: Record<string, unknown>) => any;
      marker: (coords: [number, number], options?: Record<string, unknown>) => any;
      latLngBounds: (coords: Array<[number, number]>) => any;
    };
  }
}

type LeafletApi = NonNullable<Window["L"]>;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ----------------------- Small UI pieces ----------------------- */

function PillTab({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-12 rounded-lg px-3 text-[12px] font-medium transition",
        active
          ? "bg-[#0B1B33] text-white"
          : "text-slate-600 hover:bg-slate-100"
      )}
      type="button"
    >
      {children}
    </button>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "relative h-6 w-11 rounded-full border transition",
        value ? "bg-[#0B1B33] border-[#0B1B33]" : "bg-white border-slate-200"
      )}
      aria-pressed={value}
    >
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition",
          value ? "left-5" : "left-1"
        )}
      />
    </button>
  );
}

/* ----------------------- Main components ----------------------- */

function MapPlaceholder({ showPins }: { showPins: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mt-4 relative h-[380px] sm:h-[440px] lg:h-[520px] w-full overflow-hidden rounded-xl bg-slate-100">
        {/* Fake map background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(2,6,23,0.12),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(2,6,23,0.10),transparent_50%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(2,6,23,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.12)_1px,transparent_1px)] bg-[size:28px_28px]" />

        {/* “Kenya” label */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 text-[42px] font-black tracking-tight text-slate-700/70">
          Kenya
        </div>

        {/* Pins */}
        {showPins && (
          <>
            <div className="absolute left-[30%] top-[45%] h-4 w-4 rounded-full bg-rose-500 shadow-[0_10px_20px_rgba(244,63,94,0.35)] ring-4 ring-rose-200" />
            <div className="absolute left-[36%] top-[58%] h-4 w-4 rounded-full bg-rose-500 shadow-[0_10px_20px_rgba(244,63,94,0.35)] ring-4 ring-rose-200" />
            <div className="absolute left-[42%] top-[65%] h-4 w-4 rounded-full bg-sky-500 shadow-[0_10px_20px_rgba(14,165,233,0.25)] ring-4 ring-sky-200" />
          </>
        )}
      </div>
    </div>
  );
}

function loadLeaflet(): Promise<LeafletApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Leaflet requires a browser environment."));
  }
  if (window.L) return Promise.resolve(window.L);

  const cssHref = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  const jsSrc = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

  if (!document.querySelector(`link[href="${cssHref}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssHref;
    document.head.appendChild(link);
  }

  return new Promise<LeafletApi>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${jsSrc}"]`);
    if (existing) {
      if (window.L) {
        resolve(window.L);
        return;
      }
      existing.addEventListener("load", () => {
        if (window.L) resolve(window.L);
        else reject(new Error("Leaflet failed to load."));
      });
      existing.addEventListener("error", () => reject());
      return;
    }

    const script = document.createElement("script");
    script.src = jsSrc;
    script.async = true;
    script.onload = () => {
      if (window.L) resolve(window.L);
      else reject(new Error("Leaflet failed to load."));
    };
    script.onerror = () => reject(new Error("Leaflet failed to load."));
    document.body.appendChild(script);
  });
}

function MapPanel({
  points,
  showPins,
}: {
  points: Array<{ lat: number; lng: number; title?: string; location?: string }>;
  showPins: boolean;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!mapRef.current || points.length === 0) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
        setMapReady(false);
      }
      return;
    }

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapRef.current || !L) return;

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: true,
            attributionControl: true,
          });
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(mapInstanceRef.current);
          setMapReady(true);
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        const bounds = L.latLngBounds(
          points.map((point) => [point.lat, point.lng])
        );

        if (showPins) {
          points.forEach((point) => {
            const marker = L.marker([point.lat, point.lng]).addTo(
              mapInstanceRef.current
            );
            if (point.title) {
              const label = point.location
                ? `${point.title} — ${point.location}`
                : point.title;
              marker.bindPopup(label);
            }
            markersRef.current.push(marker);
          });
        }

        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
      })
      .catch(() => {
        // ignore load errors; placeholder will remain
      });

    return () => {
      cancelled = true;
    };
  }, [points, showPins]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (points.length === 0) {
    return <MapPlaceholder showPins={showPins} />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Map Preview
        </p>
        <p className="mt-1 text-[14px] font-medium text-slate-800">
          {points.length} location{points.length > 1 ? "s" : ""} selected
        </p>
      </div>
      <div className="relative z-0 h-[380px] sm:h-[440px] lg:h-[520px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <div ref={mapRef} className="h-full w-full" />
        {!mapReady ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-500">
            Loading map...
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ListingCard({
  item,
  onEmailClick,
  onWhatsAppClick,
  onFavoriteClick,
  isBookmarked,
  isLoading,
}: {
  item: Listing;
  onEmailClick: (listing: Listing) => void;
  onWhatsAppClick: (listing: Listing) => void;
  onFavoriteClick: (listing: Listing) => void;
  isBookmarked: boolean;
  isLoading?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Image */}
        <div className="relative h-[220px] md:h-full bg-slate-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 280px"
          />
          <span className="absolute left-3 top-3 rounded-full bg-[#0B1B33] px-3 py-1 text-[11px] font-semibold text-white">
            {item.tag}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[24px] font-semibold text-[#1E1E1E]">
                {item.price}
              </div>
              <div className="mt-1 text-[16px] text-[#7D7D7D] flex items-center gap-2">
                <span>
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                {item.location}
              </div>
            </div>

            <div className="inline-flex items-center gap-4 text-slate-500">
              <button
                className="inline-flex items-center gap-2 text-[16px] hover:text-slate-700"
                type="button"
              >
                <Share2 className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                className={cn(
                  "inline-flex items-center gap-2 text-[16px] transition",
                  isBookmarked
                    ? "text-rose-600 hover:text-rose-700"
                    : "text-slate-500 hover:text-slate-700"
                )}
                type="button"
                onClick={() => onFavoriteClick(item)}
                aria-pressed={isBookmarked}
                disabled={isLoading}
              >
                <Heart
                  className="h-4 w-4"
                  fill={isBookmarked ? "currentColor" : "none"}
                />{" "}
                <span className="hidden sm:inline">
                  {isBookmarked ? "Saved" : "Favorite"}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700">
              {item.status}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
              <BedDouble className="h-3.5 w-3.5 text-slate-500" /> {item.beds} Beds
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
              <Bath className="h-3.5 w-3.5 text-slate-500" /> {item.baths} Baths
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
              <Ruler className="h-3.5 w-3.5 text-slate-500" /> Built-up:{" "}
              {item.builtUp}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
              <Ruler className="h-3.5 w-3.5 text-slate-500" /> Plot: {item.plot}
            </span>
          </div>

          <div className="mt-3 text-[16px] text-[#1E1E1E]">{item.title}</div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => onEmailClick(item)}
              className="h-10 w-full sm:w-[260px] rounded-lg border border-slate-300 bg-white text-[13px] font-semibold text-slate-800 hover:bg-slate-50 inline-flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" /> Email
            </button>

            <button
              type="button"
              onClick={() => onWhatsAppClick(item)}
              className="h-10 w-full sm:w-[260px] rounded-lg bg-[#0B1B33] text-[13px] font-semibold text-white hover:opacity-95 inline-flex items-center justify-center gap-2"
            >
              <Image
                src={"/WhatsApp.png"}
                width={1000}
                height={1000}
                className="w-5 h-5"
                alt=""
              />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Page ----------------------- */

export default function ResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationParam = (searchParams.get("location") || "").trim();
  const [showPins, setShowPins] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const { data: session } = useSession();
  const userId = session?.user?._id as string | undefined;
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState<string | null>(
    null
  );
  const [selectedMapListing, setSelectedMapListing] = useState<Listing | null>(
    null
  );

  // ✅ email modal state
  const [emailOpen, setEmailOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const openEmailModal = (listing: Listing) => {
    if (!userId) {
      toast.error("Please login to email the agent.");
      return;
    }

    setSelectedListing(listing);
    setEmailOpen(true);
  };

  const initialValues = {
    type: searchParams.get("type") || "",
    location: searchParams.get("location") || "",
    price: searchParams.get("price") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    minLand: searchParams.get("minLand") || "",
    maxLand: searchParams.get("maxLand") || "",
    parking: searchParams.get("parking") || "",
    gatedCommunity: searchParams.get("gatedCommunity") || "",
    staffQuarters: searchParams.get("staffQuarters") || "",
    transaction: searchParams.get("transaction") || "",
    listingType: searchParams.get("listingType") || "",
    propertyType: searchParams.get("propertyType") || "all",
  };

  const buildQueryString = (includeLocation: boolean) => {
    const query = new URLSearchParams();

    const searchTerm = searchParams.get("type");
    const location = searchParams.get("location");
    const price = searchParams.get("price");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const minLand = searchParams.get("minLand");
    const maxLand = searchParams.get("maxLand");
    const parking = searchParams.get("parking");
    const gatedCommunity = searchParams.get("gatedCommunity");
    const staffQuarters = searchParams.get("staffQuarters");
    const propertyType = searchParams.get("propertyType");
    const listingTypeParam = searchParams.get("listingType");
    const transaction = searchParams.get("transaction");

    if (searchTerm) query.set("searchTerm", searchTerm);
    if (includeLocation && location) query.set("location", location);
    if (price) query.set("price", price);
    if (bedrooms) query.set("bedrooms", bedrooms);
    if (bathrooms) query.set("bathrooms", bathrooms);
    if (minLand) query.set("minLand", minLand);
    if (maxLand) query.set("maxLand", maxLand);
    if (parking === "true" || parking === "false") {
      query.set("parking", parking);
    }
    if (gatedCommunity === "true" || gatedCommunity === "false") {
      query.set("gatedCommunity", gatedCommunity);
    }
    if (staffQuarters === "true" || staffQuarters === "false") {
      query.set("staffQuarters", staffQuarters);
    }
    if (propertyType && propertyType.toLowerCase() !== "all") {
      query.set("propertyType", propertyType);
    }

    if (listingTypeParam) {
      query.set("listingType", listingTypeParam);
    } else if (transaction) {
      const normalized = transaction.toLowerCase();
      if (normalized === "rent" || normalized === "for rent") {
        query.set("listingType", "For Rent");
      } else if (
        normalized === "sale" ||
        normalized === "for sale" ||
        normalized === "buy" ||
        normalized === "sell"
      ) {
        query.set("listingType", "For Sale");
      }
    }

    query.set("status", "approved");
    return query.toString();
  };

  const queryString = useMemo(
    () => buildQueryString(true),
    [searchParams]
  );
  const queryStringWithoutLocation = useMemo(
    () => buildQueryString(false),
    [searchParams]
  );

  const fetchProperties = async (query: string): Promise<Property[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    if (!baseUrl) {
      throw new Error("Missing NEXT_PUBLIC_BACKEND_API_URL");
    }

    const res = await fetch(`${baseUrl}/property/?${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch properties");
    }

    const json: PropertyApiResponse = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error("Invalid API response");
    }

    return json.data;
  };

  const { data, isLoading, isError } = useQuery<Property[], Error>({
    queryKey: ["search-properties", queryString],
    queryFn: () => fetchProperties(queryString),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const { data: locationData } = useQuery<Property[], Error>({
    queryKey: ["search-properties-locations", queryStringWithoutLocation],
    queryFn: () => fetchProperties(queryStringWithoutLocation),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!data || !userId) {
      setBookmarkedIds(new Set());
      return;
    }

    const initial = new Set<string>();
    data.forEach((property) => {
      const bookmarks = property.bookmarkUser ?? [];
      const hasBookmark = bookmarks.some((entry) => {
        if (typeof entry === "string") return entry === userId;
        if (entry && typeof entry === "object") {
          const candidate = (entry as { _id?: string })._id;
          return candidate === userId;
        }
        return false;
      });
      if (hasBookmark) initial.add(property._id);
    });

    setBookmarkedIds(initial);
  }, [data, userId]);

  const listings = useMemo<Listing[]>(() => {
    if (!data) return [];

    return data.map((property) => {
      const priceDisplay =
        property.listingType === "For Rent"
          ? `KSh ${property.price.toLocaleString()}/mo`
          : `KSh ${property.price.toLocaleString()}`;

      const tag =
        property.purpose?.toLowerCase().includes("off") ? "Off-Plan" : "Ready";

      const rawAgent = Array.isArray(property.listingUser)
        ? (property.listingUser[0] as { phoneNumber?: string } | undefined)
        : undefined;
      const phoneNumber =
        typeof rawAgent?.phoneNumber === "string" ? rawAgent.phoneNumber : undefined;

      return {
        id: property._id,
        price: priceDisplay,
        location: property.location,
        title: property.title,
        image: property.images?.[0] || "/fallback-property.jpg",
        tag,
        status: "Available",
        beds: property.bedrooms,
        baths: property.bathrooms,
        builtUp: `${property.area} sqm`,
        plot: property.plot ? `${property.plot} sqm` : "N/A",
        lat: property.lat,
        lng: property.lng,
        phoneNumber,
      };
    });
  }, [data]);

  const locationTabs = useMemo(() => {
    const source = locationData ?? data ?? [];
    if (source.length === 0) return [];

    const deduped = new Map<string, { key: string; label: string; count: number }>();

    for (const property of source) {
      const raw = (property.location || "").toString().trim();
      if (!raw) continue;
      const key = raw.toLowerCase();
      const existing = deduped.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        deduped.set(key, { key, label: raw, count: 1 });
      }
    }

    return Array.from(deduped.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [locationData, data]);

  useEffect(() => {
    if (!locationParam) {
      setActiveTab("all");
      return;
    }
    setActiveTab(locationParam.toLowerCase());
  }, [locationParam]);

  const handleLocationTabClick = (tabKey: string, locationValue?: string) => {
    setActiveTab(tabKey);

    const params = new URLSearchParams(searchParams.toString());
    if (!locationValue) {
      params.delete("location");
    } else {
      params.set("location", locationValue);
    }

    const query = params.toString();
    router.push(`/serach-result${query ? `?${query}` : ""}`);
  };

  const handleWhatsAppClick = (listing: Listing) => {
    if (!userId) {
      toast.error("Please login to message on WhatsApp.");
      return;
    }

    const trimmed = listing.phoneNumber?.trim() ?? "";

    if (!trimmed) {
      toast.error("Not available on WhatsApp");
      return;
    }

    const normalized = trimmed.replace(/[^\d+]/g, "");
    const numberForLink = normalized.replace(/^\+/, "");

    if (!numberForLink) {
      toast.error("Not available on WhatsApp");
      return;
    }

    window.open(`https://wa.me/${numberForLink}`, "_blank", "noopener,noreferrer");
  };

  const mapPoints = useMemo(() => {
    const points = listings.filter(
      (listing) =>
        bookmarkedIds.has(listing.id) &&
        typeof listing.lat === "number" &&
        typeof listing.lng === "number"
    );

    if (points.length > 0) {
      return points.map((listing) => ({
        lat: listing.lat as number,
        lng: listing.lng as number,
        title: listing.title,
        location: listing.location,
      }));
    }

    if (
      selectedMapListing &&
      typeof selectedMapListing.lat === "number" &&
      typeof selectedMapListing.lng === "number"
    ) {
      return [
        {
          lat: selectedMapListing.lat,
          lng: selectedMapListing.lng,
          title: selectedMapListing.title,
          location: selectedMapListing.location,
        },
      ];
    }

    return [];
  }, [bookmarkedIds, listings, selectedMapListing]);

  const handleBookmarkToggle = async (listing: Listing) => {
    if (!listing.id) return;

    setSelectedMapListing(listing);

    if (!userId) {
      toast.error("Please login.");
      return;
    }

    const isBookmarked = bookmarkedIds.has(listing.id);
    setBookmarkLoadingId(listing.id);

    try {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) {
          next.delete(listing.id);
        } else {
          next.add(listing.id);
        }
        return next;
      });

      if (isBookmarked) {
        await api.delete(`/bookmark/${listing.id}`);
        toast.success("Bookmark removed.");
      } else {
        await api.post(`/bookmark/${listing.id}`);
        toast.success("Property bookmarked.");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update bookmark.";
      toast.error(message);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) {
          next.add(listing.id);
        } else {
          next.delete(listing.id);
        }
        return next;
      });
    } finally {
      setBookmarkLoadingId(null);
    }
  };

  return (
    <div className="w-full bg-white">
      <SearchFilter
        initialValues={initialValues}
        submitPath="/serach-result"
        autoSubmitOnListingTypeChange
      />
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Title */}
        <div className="mt-8">
          <h1 className="text-[24px] sm:text-[40px] font-bold text-[#061F3D]">
            Properties For Sale –{" "}
            <span className="text-[#0B1B33]">{listings.length}</span>{" "}
            listings found
          </h1>
        </div>

        {/* Tabs row */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-2">
          <div className="flex flex-wrap gap-2">
            <PillTab active={activeTab === "all"} onClick={() => handleLocationTabClick("all")}>
              All ({(locationData ?? data ?? []).length})
            </PillTab>
            {locationTabs.map((tab) => (
              <PillTab
                key={tab.key}
                active={activeTab === tab.key}
                onClick={() => handleLocationTabClick(tab.key, tab.label)}
              >
                {tab.label} ({tab.count})
              </PillTab>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] text-slate-700 shadow-sm">
            <span className="font-medium">Show Pins</span>
            <Toggle value={showPins} onChange={setShowPins} />
          </div>
        </div>

        {/* Map + List */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left Map */}
          <div className="lg:col-span-5">
            <MapPanel points={mapPoints} showPins={showPins} />
          </div>

          {/* Right list */}
          <div className="space-y-5 lg:col-span-7">
            {isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                Loading properties...
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-red-600">
                Failed to load properties. Please try again.
              </div>
            ) : listings.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                No listings match your filters.
              </div>
            ) : (
              listings.map((item) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  onEmailClick={openEmailModal}
                  onWhatsAppClick={handleWhatsAppClick}
                  onFavoriteClick={handleBookmarkToggle}
                  isBookmarked={bookmarkedIds.has(item.id)}
                  isLoading={bookmarkLoadingId === item.id}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Email Modal (separate component) */}
      <EmailModal
        open={emailOpen}
        onOpenChange={setEmailOpen}
        listing={
          selectedListing
            ? {
                id: selectedListing.id,
                price: selectedListing.price,
                location: selectedListing.location,
                title: selectedListing.title,
              }
            : null
        }
      />
    </div>
  );
}
