"use client";

import Image from "next/image";
import { Heart, Share2, MapPin, BedDouble, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ---------------- DUMMY DATA ---------------- */
const listings = [
  {
    id: 1,
    tag: "Off-Plan",
    image: "/vendor4.png",
    price: "KSh 45.0M",
    location: "Westland’s, Nairobi",
    availability: "Available",
    beds: 5,
    baths: 6,
    builtUp: "2,364 sqft",
    plot: "1,550 sqft",
    tagline: "Genuine Resale | End Unit | Luxurious",
  },
  {
    id: 2,
    tag: "Off-Plan",
    image: "/vendor4.png",
    price: "KSh 45.0M",
    location: "Westland’s, Nairobi",
    availability: "Available",
    beds: 5,
    baths: 6,
    builtUp: "2,364 sqft",
    plot: "1,550 sqft",
    tagline: "Genuine Resale | End Unit | Luxurious",
  },
  {
    id: 3,
    tag: "Off-Plan",
    image: "/vendor4.png",
    price: "KSh 45.0M",
    location: "Westland’s, Nairobi",
    availability: "Available",
    beds: 5,
    baths: 6,
    builtUp: "2,364 sqft",
    plot: "1,550 sqft",
    tagline: "Genuine Resale | End Unit | Luxurious",
  },
  {
    id: 4,
    tag: "Off-Plan",
    image: "/vendor4.png",
    price: "KSh 45.0M",
    location: "Westland’s, Nairobi",
    availability: "Available",
    beds: 5,
    baths: 6,
    builtUp: "2,364 sqft",
    plot: "1,550 sqft",
    tagline: "Genuine Resale | End Unit | Luxurious",
  },
];

export default function AgentListingsSection() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-xl sm:text-4xl font-bold text-[#061F3D]">
          Sarah Wanjiku&apos;s Listings (4)
        </h2>

        {/* Listings */}
        <div className="mt-6 space-y-4">
          {listings.map((item) => (
            <ListingRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ListingRow({ item }: { item: (typeof listings)[number] }) {
  return (
    <div className="rounded-xl border border-[#EDEDED] bg-white overflow-hidden">
      <div className="grid md:grid-cols-[290px_1fr]">
        {/* Image */}
        <div className="relative h-full w-full">
          <Image src={item.image} alt="Listing" fill className="object-cover" />

          {/* Tag badge */}
          <span className="absolute hidden md:block left-3 top-3 rounded-full bg-[#0B1C39] px-3 py-1 text-[11px] font-semibold text-white">
            {item.tag}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Top row: price + actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-2xl font-semibold text-[#1E1E1E]">{item.price}</p>

              <div className="mt-1 flex items-center gap-2 text-base text-[#7D7D7D]">
                <MapPin className="h-3.5 w-3.5" />
                <span>{item.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#6F6F6F]">
              <button className="inline-flex items-center gap-2 hover:text-[#0B1C39] transition">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="inline-flex items-center gap-2 hover:text-[#0B1C39] transition">
                <Heart className="h-4 w-4" />
                Favorite
              </button>
            </div>
          </div>

          {/* Pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill active>
              <span className="h-2 w-2 rounded-full bg-[#0B1C39]" />
              {item.availability}
            </Pill>
            <Pill>
              <BedDouble className="h-3.5 w-3.5" />
              {item.beds} Beds
            </Pill>
            <Pill>
              <Bath className="h-3.5 w-3.5" />
              {item.baths} Baths
            </Pill>
            <Pill>
              <Square className="h-3.5 w-3.5" />
              Built-up: {item.builtUp}
            </Pill>
            <Pill>
              <Square className="h-3.5 w-3.5" />
              Plot: {item.plot}
            </Pill>
          </div>

          {/* Tagline */}
          <p className="mt-3 text-xs sm:text-base font-medium text-[#1E1E1E]">
            {item.tagline}
          </p>

          {/* Actions */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="h-10 rounded-md border-[#0B1C39]/30 text-[#0B1C39] hover:bg-[#0B1C39]/5"
            >
              Email
            </Button>

            <Button className="h-10 rounded-md bg-[#061F3D] hover:bg-[#061F3D]/90 text-white">
              <span className="inline-flex items-center gap-2">
                <span>
                    <Image src="/WhatsApp.png" alt="WhatsApp" width={1000} height={1000} className="w-5 h-5" />
                </span>
                WhatsApp
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-md border bg-white px-3 py-1 text-[11px] text-[#6F6F6F]",
        active ? "border-[#0B1C39]/30 text-[#0B1C39]" : "border-[#E6E6E6]",
      ].join(" ")}
    >
      {children}
    </span>
  );
}