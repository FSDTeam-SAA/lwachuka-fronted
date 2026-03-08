"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/common/PropertyCard";
import { FeaturedPropertySkeleton } from "@/components/skeleton/FeaturedPropertySkeleton";

type TabType = "all" | "sale" | "rent";

interface Property {
  _id: string;
  title: string;
  listingType: "For Sale" | "For Rent";
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  plot: number;
  location: string;
  price: number;
  images: string[];
  status: "approved" | "rejected" | "pending";
  description?: string;
  // add more fields later if needed
}

async function fetchApprovedProperties(): Promise<Property[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/property/subscriber-property-top?status=approved`); 

  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }

  const json: {
    success: boolean;
    data: Property[];
  } = await res.json();

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Invalid API response");
  }

  return json.data.filter((p) => p.status === "approved");
}

export function PropertyListingsSection() {
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "sale" || tabParam === "rent" || tabParam === "all") {
      return tabParam;
    }
    return "all";
  });

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "sale" || tabParam === "rent" || tabParam === "all") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery<Property[], Error>({
    queryKey: ["public-properties-approved"],
    queryFn: fetchApprovedProperties,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30,  
  });

  const saleCount = data?.filter((p) => p.listingType === "For Sale").length ?? 0;
  const rentCount = data?.filter((p) => p.listingType === "For Rent").length ?? 0;
  const totalCount = data?.length ?? 0;

  const displayedProperties = useMemo(() => {
    if (!data) return [];

    let filtered = data;

    if (activeTab === "sale") {
      filtered = data.filter((p) => p.listingType === "For Sale");
    } else if (activeTab === "rent") {
      filtered = data.filter((p) => p.listingType === "For Rent");
    }
 

    return filtered.slice(0, 3);
  }, [data, activeTab]);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-[32px] font-bold text-[#0B1C39]">
            All <span className="text-[#D3920E]">Property Listings</span>
          </h2>
          <p className="mt-3 text-base text-[#8E938F]">
            Discover a curated selection of modern, high-quality properties in prime locations
            across Kenya.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex items-center gap-8 md:gap-12 text-xl font-medium">
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            label={`All Properties (${totalCount})`}
          />
          <TabButton
            active={activeTab === "sale"}
            onClick={() => setActiveTab("sale")}
            label={`For Sale (${saleCount})`}
          />
          <TabButton
            active={activeTab === "rent"}
            onClick={() => setActiveTab("rent")}
            label={`For Rent (${rentCount})`}
          />
        </div>

        {/* Content */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              <FeaturedPropertySkeleton />
              <FeaturedPropertySkeleton />
              <FeaturedPropertySkeleton />
            </>
          ) : isError ? (
            <div className="col-span-full py-16 text-center text-red-600">
              Sorry, we couldn&apos;t load the properties right now. Please try again later.
            </div>
          ) : displayedProperties.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500">
              {activeTab === "all"
                ? "No approved properties available at the moment."
                : activeTab === "sale"
                ? "No properties currently listed for sale."
                : "No rental properties available right now."}
            </div>
          ) : (
            displayedProperties.map((property) => {
              const mainImage = property.images?.[0] ?? "/placeholder-property.jpg";

              const priceDisplay =
                property.listingType === "For Rent"
                  ? `KSh ${property.price.toLocaleString()} / month`
                  : property.price >= 1_000_000
                  ? `KSh ${(property.price / 1_000_000).toFixed(1)}M`
                  : `KSh ${property.price.toLocaleString()}`;

              return (
                <PropertyCard
                  key={property._id}
                  id={property._id}
                  image={mainImage}
                  title={property.title}
                  location={property.location}
                  price={priceDisplay}
                  beds={property.bedrooms}
                  baths={property.bathrooms}
                  status={property.listingType} 
                  availability="Available"
                  builtUpSqft={`${property.area} sqm`}
                  plotSqft={property.plot }
                  tagline={
                    property.propertyType ||
                    (property.listingType === "For Rent" ? "Rental Apartment" : "Residential")
                  }
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative pb-2.5 text-lg transition-colors
        ${active ? "text-[#0B1C39] font-semibold" : "text-[#8A8A8A] hover:text-[#0B1C39]"}
      `}
    >
      {label}
      <span
        className={`
          absolute left-0 bottom-0 h-0.5 w-full rounded-full transition-all
          ${active ? "bg-[#0B1C39] scale-x-100" : "bg-transparent scale-x-0"}
        `}
      />
    </button>
  );
}
