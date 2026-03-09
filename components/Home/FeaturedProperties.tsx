
"use client";

import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "../common/PropertyCard";
import { FeaturedPropertySkeleton } from "../skeleton/FeaturedPropertySkeleton";
import { Property, PropertyApiResponse } from "@/types/PropertyType";



async function fetchFeaturedProperties(): Promise<Property[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/subscriber-property-top?status=approved`, {
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

export function FeaturedProperties() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: fetchFeaturedProperties,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Optional: you can show 3-6 featured items only
  const displayedProperties = data?.slice(0, 6) ?? [];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-[#061F3D] text-4xl font-bold text-center">
            Featured <span className="text-[#D3920E]">Properties</span>
          </h1>
          <p className="text-[#7D7D7D] text-base font-normal text-center mt-2">
            Handpicked premium properties across Kenya&apos;s most sought-after locations
          </p>
        </div>

        {/* Properties Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              <FeaturedPropertySkeleton />
              <FeaturedPropertySkeleton />
              <FeaturedPropertySkeleton />
            </>
          ) : error ? (
            <div className="col-span-3 text-center text-red-600 py-10">
              Failed to load properties. Please try again later.
            </div>
          ) : displayedProperties.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500 py-10">
              No featured properties available at the moment.
            </div>
          ) : (
            displayedProperties.slice(0 ,6).map((property) => (
              <PropertyCard
                key={property._id}
                id={property._id}
                image={property.images[0] || "/fallback-property.jpg"}
                title={property.title}
                location={property.location}
                price={
                  property.listingType === "For Sale"
                    ? `KSh ${property.price.toLocaleString()}`
                    : `KSh ${property.price.toLocaleString()}/mo`
                }
                beds={property.bedrooms}
                baths={property.bathrooms}
                builtUpSqft={`${property.area} sqm`} 
                plotSqft={property?.plot || 0}
                tagline={property.description.slice(0, 60) + "..."}
                status={property.listingType as "For Sale" | "For Rent"}
                availability="Available" 
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}