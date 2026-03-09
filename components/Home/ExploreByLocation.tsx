


"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NearbyPropertySkeleton } from "../skeleton/NearbyPropertySkeleton";
import { Property, PropertyApiResponse } from "@/types/PropertyType";
import Link from "next/link";

async function fetchProperties(): Promise<Property[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/property/subscriber-property-top?status=approved`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", 
  });

  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }

  const json: PropertyApiResponse = await res.json();

  return json.data.filter((p) => p.status === "approved");
}

export function ExploreByLocation() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", "approved"],
    queryFn: fetchProperties,
    staleTime: 4 * 60 * 1000,
  });

  // Take first 3–6 items (you can later filter by proximity using lat/lng)
  const displayedProperties = data?.slice(0, 6) ?? [];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
            Explore <span className="text-[#D3920E]">Properties</span> by Location
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#8A8A8A]">
            Use our interactive map to discover properties in your preferred neighborhoods
          </p>
        </div>

        {/* Layout */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
          {/* Map */}
          <div className="relative w-full h-[420px] md:h-[460px] rounded-2xl overflow-hidden bg-[#F4F6F8]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.16174540213!2d36.76499554664578!3d-1.3032076027224155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sbd!4v1772525152311!5m2!1sen!2sbd"
              width="600"
              height="450"
              loading="lazy"
              className="w-full h-full"
              title="Nairobi Map"
              allowFullScreen
            />
          </div>

          {/* Right: Nearby / Featured list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-[#1E1E1E]">
                Nearby Properties
              </h3>
              <Link href="/properties" >
              <Button
                variant="ghost"
                className="h-auto p-0 text-base text-[#061F3D] hover:bg-transparent"
              >
                See All
              </Button>
              </Link>
            </div>

            <div className="space-y-4 min-h-[300px]">
              {isLoading ? (
                <>
                  <NearbyPropertySkeleton/>
                  <NearbyPropertySkeleton />
                  <NearbyPropertySkeleton />
                </>
              ) : error ? (
                <div className="text-center text-red-600 py-8">
                  Could not load properties. Please try again later.
                </div>
              ) : displayedProperties.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No approved properties available right now.
                </div>
              ) : (
                displayedProperties.slice(0, 3).map((prop) => (
                  <div
                    key={prop._id}
                    className="rounded-2xl border border-[#E9E9E9] bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative h-[80px] w-[80px] rounded-xl overflow-hidden flex-shrink-0 bg-[#F4F6F8]">
                        <Image
                          src={prop.images?.[0] ?? "/fallback-property.jpg"}
                          alt={prop.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-semibold text-[#0B1C39]">
                              {prop.title}
                            </h4>
                            <p className="mt-1 flex items-center gap-1 text-xs text-[#8A8A8A]">
                              <MapPin className="h-3.5 w-3.5" />
                              {prop.location}
                            </p>
                          </div>

                          <div className="text-right text-sm font-semibold text-[#D3920E] whitespace-nowrap">
                            {prop.listingType === "For Rent"
                              ? `KSh ${prop.price.toLocaleString()}/mo`
                              : `KSh ${prop.price.toLocaleString()}`}
                          </div>
                        </div>

                        {/* Feature pills */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md border border-[#ECECEC] bg-[#F7F8F8] px-2.5 py-1 text-[11px] text-[#6F6F6F]">
                            <BedDouble className="h-3.5 w-3.5" />
                            {prop.bedrooms} Beds
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-md border border-[#ECECEC] bg-[#F7F8F8] px-2.5 py-1 text-[11px] text-[#6F6F6F]">
                            <Bath className="h-3.5 w-3.5" />
                            {prop.bathrooms} Baths
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-md border border-[#ECECEC] bg-[#F7F8F8] px-2.5 py-1 text-[11px] text-[#6F6F6F]">
                            <Square className="h-3.5 w-3.5" />
                            {prop.area} m²
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}