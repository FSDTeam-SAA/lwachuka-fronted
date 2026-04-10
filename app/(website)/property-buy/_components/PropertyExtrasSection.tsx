"use client";

import {
  BedDouble,
  Bath,
  Ruler,
  Utensils,
  Car,
  Sparkles,
  Wind,
  CheckCircle2,
  Mountain,
  Shirt,
  Sofa,
  ConciergeBell,
  PawPrint,
  CookingPot,
  HeartHandshake,
  Users,
  ClipboardList,
  Salad,
  Siren,
  Bus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactModal from "./ContactModal";
import { Property } from "@/types/PropertyType";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const formatPrice = (price?: number, listingType?: Property["listingType"]) => {
  if (price == null) return "N/A";
  const formatted = `KSh ${price.toLocaleString()}`;
  return listingType === "For Rent" ? `${formatted}/mo` : formatted;
};

// const formatArea = (value?: number) => {
//   if (!value && value !== 0) return "N/A";
//   return `${value.toLocaleString()} sqm`;
// };

const formatAreaValue = (value?: number) => {
  if (value == null) return undefined;
  return `${value.toLocaleString()} sqm`;
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getAmenityIcon = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes("concierge")) return ConciergeBell;
  if (normalized.includes("pet")) return PawPrint;
  if (normalized.includes("faith")) return HeartHandshake;
  if (normalized.includes("community")) return Users;
  if (normalized.includes("move")) return ClipboardList;
  if (normalized.includes("diet")) return Salad;
  if (normalized.includes("emergency")) return Siren;
  if (normalized.includes("transport")) return Bus;
  if (normalized.includes("furnish")) return Sofa;
  if (normalized.includes("meal")) return CookingPot;
  return CheckCircle2;
};

const hasValue = (value: unknown) => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

const formatKeyLabel = (label: string, value?: string) =>
  hasValue(value) ? `${label}: ${value}` : undefined;

const formatBuiltUp = (value?: number | string) => {
  if (!hasValue(value)) return undefined;
  if (typeof value === "number") return formatAreaValue(value);
  return value?.toString();
};

/* ---------------- COMPONENT ---------------- */

export function PropertyExtrasSection({
  property,
  isLoading,
}: {
  property?: Property;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <PropertyExtrasSectionSkeleton />;
  }

  if (!property) {
    return null;
  }

  const session = useSession();
  const islogin = session?.status;
  const bedroomsLabel = hasValue(property.keyBedRooms)
    ? `Bedrooms: ${property.keyBedRooms}`
    : property.bedrooms != null
      ? `${property.bedrooms} Bedrooms`
      : undefined;

  const bathroomsLabel = hasValue(property.keyBathrooms)
    ? `Bathrooms: ${property.keyBathrooms}`
    : property.bathrooms != null
      ? `${property.bathrooms} Bathrooms`
      : undefined;

  const builtUpValue = hasValue(property.keyBuiltUp)
    ? formatBuiltUp(property.keyBuiltUp)
    : formatAreaValue(property.builtUp ?? property.area);

  const highlights = [
    { icon: BedDouble, label: bedroomsLabel },
    { icon: Bath, label: bathroomsLabel },
    {
      icon: Ruler,
      label: builtUpValue ? `Built-up: ${builtUpValue}` : undefined,
    },
    { icon: Mountain, label: formatKeyLabel("Balcony", property.keyBalconyType) },
    { icon: Utensils, label: formatKeyLabel("Kitchen", property.keyKitchenType) },
    { icon: Shirt, label: formatKeyLabel("Storage", property.keyStorage) },
    { icon: Car, label: formatKeyLabel("Parking", property.keyParking) },
    { icon: Wind, label: formatKeyLabel("Cooling", property.keyCoolingSystem) },
    { icon: Sparkles, label: formatKeyLabel("Finishes", property.keyFinishes) },
    { icon: CheckCircle2, label: formatKeyLabel("Move-in", property.keyMoveInStatus) },
  ].filter(
    (item): item is { icon: typeof BedDouble; label: string } =>
      Boolean(item.label)
  );

  const amenities = (property.propertyCommunityAmenities ?? []).map((label) => ({
    icon: getAmenityIcon(label),
    label,
  }));

  const infoRows = [
    {
      leftLabel: "Type",
      leftValue: property.propertyType || "N/A",
      rightLabel: "Added on",
      rightValue: formatDate(property.addedOn || property.createdAt),
    },
    {
      leftLabel: "Purpose",
      leftValue: property.purpose || property.listingType || "N/A",
      rightLabel: "Original price",
      rightValue: formatPrice(property.originalPrice, property.listingType),
    },
    {
      leftLabel: "Reference no.",
      leftValue: property.referenceNumber || "N/A",
      rightLabel: "Handover date",
      rightValue: formatDate(property.handoverDate),
    },
    {
      leftLabel: "Furnishing",
      leftValue: property.furnishing || "N/A",
      rightLabel: "Completion",
      rightValue: property.keyMoveInStatus || "N/A",
    },
  ];

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Key Property Highlights */}
        <div>
          <h2 className="text-[32px] font-bold text-[#0B1C39]">
            Key <span className="text-[#D3920E]">Property Highlights</span>
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-[#8A8A8A]">
            A thoughtfully designed property offering modern features, quality
            finishes, and a comfortable living experience in a prime location.
          </p>

          <div className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
            {highlights.length === 0 ? (
              <div className="text-sm text-[#8A8A8A]">
                No highlights listed.
              </div>
            ) : (
              highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-sm text-[#0B1C39]"
                  >
                    <Icon className="h-4 w-4 text-[#D3920E]" />
                    <span className="text-[#2B2B2B]">{item.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Property & Community Amenities */}
        <div className="mt-14">
          <h2 className="text-[32px] font-bold text-[#0B1C39]">
            Property &{" "}
            <span className="text-[#D3920E]">Community Amenities</span>
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-[#8A8A8A]">
            A range of modern facilities and conveniences designed to enhance
            everyday living and provide comfort, safety, and convenience.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {amenities.length === 0 ? (
              <div className="text-sm text-[#8A8A8A]">No amenities listed.</div>
            ) : (
              amenities.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E8] bg-white px-4 py-2 text-sm text-[#2B2B2B]"
                  >
                    <Icon className="h-4 w-4 text-[#D3920E]" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Property Information */}
        <div className="mt-16">
          <h2 className="text-[32px] font-bold text-[#0B1C39]">
            Property <span className="text-[#D3920E]">Information</span>
          </h2>

          <div className="mt-6 overflow-hidden rounded-xl border border-[#EDEDED] bg-white">
            <div className="hidden border-b border-[#EDEDED] bg-[#FAFAFA] text-xs font-semibold text-[#6F6F6F] md:grid md:grid-cols-4">
              <div className="px-6 py-4"></div>
              <div className="px-6 py-4"></div>
              <div className="px-6 py-4"></div>
              <div className="px-6 py-4"></div>
            </div>

            <div className="divide-y divide-[#F0F0F0]">
              {infoRows.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 gap-3 px-4 py-5 sm:px-6 md:grid-cols-4 md:gap-0"
                >
                  <div className="text-xs font-semibold text-[#0B1C39]">
                    {row.leftLabel}
                  </div>

                  <div className="text-sm text-[#6F6F6F]">{row.leftValue}</div>

                  <div className="text-xs font-semibold text-[#0B1C39]">
                    {row.rightLabel}
                  </div>

                  <div className="text-sm text-[#6F6F6F] md:text-right">
                    {row.rightValue}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <ContactModal
              trigger={
                <Button
                  className="h-10 rounded-md bg-[#B78222] px-10 text-white hover:bg-[#9f6f1d]"
                  onClick={(event) => {
                    if (islogin === "unauthenticated") {
                      event.preventDefault();
                      event.stopPropagation();
                      toast.error("Please login");
                    }
                  }}
                >
                  Contact Now
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function PropertyExtrasSectionSkeleton() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <SkeletonLine className="h-8 w-72" />
          <SkeletonLine className="mt-3 h-4 w-full max-w-xl" />

          <div className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <SkeletonCircle className="h-4 w-4" />
                <SkeletonLine className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <SkeletonLine className="h-8 w-80" />
          <SkeletonLine className="mt-3 h-4 w-full max-w-xl" />

          <div className="mt-6 flex flex-wrap gap-3">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="h-9 w-28 rounded-full bg-[#EDEDED] animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <SkeletonLine className="h-8 w-64" />

          <div className="mt-6 overflow-hidden rounded-xl border border-[#EDEDED] bg-white">
            <div className="hidden border-b border-[#EDEDED] bg-[#FAFAFA] text-xs font-semibold text-[#6F6F6F] md:grid md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="px-6 py-4">
                  <SkeletonLine className="h-3 w-16" />
                </div>
              ))}
            </div>

            <div className="divide-y divide-[#F0F0F0]">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 gap-3 px-4 py-5 sm:px-6 md:grid-cols-4 md:gap-0"
                >
                  <SkeletonLine className="h-3 w-20" />
                  <SkeletonLine className="h-4 w-28" />
                  <SkeletonLine className="h-3 w-20" />
                  <SkeletonLine className="h-4 w-28 md:ml-auto" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <SkeletonLine className="h-10 w-40 rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#EDEDED] ${className ?? ""}`}
    />
  );
}

function SkeletonCircle({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-full bg-[#EDEDED] ${className ?? ""}`}
    />
  );
}
