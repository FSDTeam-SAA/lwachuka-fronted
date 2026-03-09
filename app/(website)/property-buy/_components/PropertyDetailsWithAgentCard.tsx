"use client";

import Image from "next/image";
import { MapPin, BedDouble, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/PropertyType";
import { toast } from "sonner";

type AgentLike = {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  expertise?: string;
  serviceArea?: string;
  approvedPropertyCount?: number;
  experience?: string;
  phoneNumber?: string;
};

const formatPrice = (price: number, listingType?: Property["listingType"]) => {
  const formatted = `KSh ${price.toLocaleString()}`;
  return listingType === "For Rent" ? `${formatted}/mo` : formatted;
};

const formatArea = (value?: number, unit = "sqm") => {
  if (!value && value !== 0) return "N/A";
  return `${value.toLocaleString()} ${unit}`;
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

/* ---------------- COMPONENT ---------------- */

export function PropertyDetailsWithAgentCard({ property }: { property: Property }) {
  const rawAgent = Array.isArray(property.listingUser)
    ? (property.listingUser[0] as AgentLike | undefined)
    : undefined;

  const agentName =
    [rawAgent?.firstName, rawAgent?.lastName].filter(Boolean).join(" ") ||
    "Listing Agent";
  const agentImage = rawAgent?.profileImage || "/agent-profile.jpg";
  const agentExpertise =
    rawAgent?.expertise || "Residential Sales, Residential Leasing";
  const agentServiceArea =
    rawAgent?.serviceArea || property.location?.split(",").pop()?.trim() || "Kenya";
  const agentProperties =
    rawAgent?.approvedPropertyCount != null
      ? `${rawAgent.approvedPropertyCount} For Sale`
      : "Properties on request";
  const agentExperience = rawAgent?.experience || "Experienced Agent";
  const agentPhone = rawAgent?.phoneNumber;

  const handleWhatsAppClick = () => {
    const trimmed = agentPhone?.trim() ?? "";

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

  const details = [
    property.propertyType && `Type: ${property.propertyType}`,
    property.purpose && `Purpose: ${property.purpose}`,
    property.keyBedRooms && `Bedrooms: ${property.keyBedRooms}`,
    property.keyBathrooms && `Bathrooms: ${property.keyBathrooms}`,
    property.keyBuiltUp && `Built-up: ${property.keyBuiltUp}`,
    property.keyKitchenType && `Kitchen: ${property.keyKitchenType}`,
    property.keyParking && `Parking: ${property.keyParking}`,
    property.keyFinishes && `Finishes: ${property.keyFinishes}`,
    property.keyCoolingSystem && `Cooling: ${property.keyCoolingSystem}`,
    property.keyStorage && `Storage: ${property.keyStorage}`,
    property.keyBalconyType && `Balcony: ${property.keyBalconyType}`,
    property.keyMoveInStatus && `Move-in: ${property.keyMoveInStatus}`,
    property.referenceNumber && `Reference: ${property.referenceNumber}`,
  ].filter(Boolean) as string[];

  const longDescription = [
    property.location ? `Located in ${property.location}.` : undefined,
    property.furnishing ? `Furnishing: ${property.furnishing}.` : undefined,
    property.handoverDate
      ? `Handover date: ${formatDate(property.handoverDate)}.`
      : undefined,
  ].filter(Boolean) as string[];

  const tagline =
    [property.purpose, property.propertyType].filter(Boolean).join(" | ") ||
    property.title;

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr] items-start">

          {/* LEFT SIDE */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#061F3D]">
              {formatPrice(property.price, property.listingType)}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-base font-medium text-[#1E1E1E]">
              <MapPin className="h-4 w-4" />
              {property.location}
            </div>

            {/* Pills */}
            <div className="mt-5 flex flex-wrap gap-3">

              <Pill active>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0B1C39]" />
                  {property.listingType}
                </span>
              </Pill>

              <Pill>
                <BedDouble className="h-4 w-4" />
                {property.bedrooms} Bedrooms
              </Pill>

              <Pill>
                <Bath className="h-4 w-4" />
                {property.bathrooms} Bathrooms
              </Pill>

              <Pill>
                <Square className="h-4 w-4" />
                Built-up: {formatArea(property.builtUp ?? property.area)}
              </Pill>

              <Pill>
                <Square className="h-4 w-4" />
                Plot: {formatArea(property.plot)}
              </Pill>

            </div>

            <p className="mt-6 text-lg font-semibold text-[#1E1E1E]">
              {tagline}
            </p>

            <p className="mt-6 text-xs sm:text-sm text-[#7D7D7D] leading-6 max-w-4xl">
              {property.description}
            </p>

            {/* Property Details */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-[#0B1C39] mb-3">
                Property Details:
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-[#8A8A8A]">
                {(details.length > 0 ? details : ["Details available on request."]).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                  
                    - {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Long Description */}
            <div className="mt-8 space-y-5 text-xs sm:text-sm text-[#8A8A8A] leading-6 max-w-4xl">
              {(longDescription.length > 0 ? longDescription : [property.description]).map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE AGENT CARD */}
          <aside className="lg:sticky lg:top-6 w-full lg:max-w-[400px] lg:justify-self-end mx-auto lg:mx-0">

            <div className="rounded-2xl border border-[#EDEDED] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden">

              <div className="p-6 sm:p-7">

                <div className="flex flex-col items-center text-center">

                  <div className="relative h-[160px] w-[160px] sm:h-[180px] sm:w-[180px] md:h-[200px] md:w-[200px] rounded-full overflow-hidden bg-[#F4F6F8]">
                    <Image
                      src={agentImage}
                      alt="Agent"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="mt-5 text-2xl font-medium text-[#061F3D]">
                    {agentName}
                  </h3>

                </div>

                <div className="mt-5 space-y-3 text-sm text-[#6F6F6F]">

                  <Row  label="Expertise">
                    {agentExpertise}
                  </Row>

                  <Row label="Service Areas">
                    {agentServiceArea}
                  </Row>

                  <Row label="Properties">
                    {agentProperties}
                  </Row>

                  <Row label="Experience">
                    {agentExperience}
                  </Row>

                </div>

                <Button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="mt-6 w-full h-11 rounded-md bg-[#061F3D] hover:bg-[#061F3D]/90 text-white"
                >
                  <span className="mr-2 inline-flex">
                    <Image
                      src="/WhatsApp.png"
                      alt="whatsapp"
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                  </span>
                  WhatsApp
                </Button>

              </div>
            </div>

          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Pill({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "h-9 px-4 rounded-md border text-xs sm:text-sm inline-flex items-center gap-2 bg-[#F7F8F8]",
        active
          ? "border-[#0B1C39]/40 text-[#0B1C39]"
          : "border-[#E6E6E6] text-[#6F6F6F]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p className="text-sm leading-6">
      <span className="font-bold text-[#1E1E1E]">{label}:</span>{" "}
      <span className="text-[#1E1E1E]">{children}</span>
    </p>
  );
}
