"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PropertyCard } from "@/components/common/PropertyCard";
import { Property, PropertyApiResponse } from "@/types/PropertyType";

async function fetchSimilarProperties(): Promise<Property[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const url = baseUrl
    ? `${baseUrl}/property/subscriber-property-top?status=approved`
    : "/property/subscriber-property-top?status=approved";
  const res = await fetch(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }

  const json: PropertyApiResponse = await res.json();
  return json.data.filter((p) => p.status === "approved");
}

export default function SimilarProperties({
  currentPropertyId,
}: {
  currentPropertyId?: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["similar-properties", currentPropertyId],
    queryFn: fetchSimilarProperties,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return <SimilarPropertiesSkeleton />;
  }

  if (error) {
    return (
      <section className="py-16 md:py-16 bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
              Similar <span className="text-[#D3920E]">Properties</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-[#8A8A8A]">
              Explore other carefully selected properties that match your preferences and lifestyle.
            </p>
          </div>
          <div className="py-10 text-center text-red-600">
            Failed to load similar properties. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  const similarProperties = (data ?? [])
    .filter((property) => property._id !== currentPropertyId)
    .slice(0, 6);

  return (
    <section className="py-16 md:py-16 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading (same style like screenshot) */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
            Similar <span className="text-[#D3920E]">Properties</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#8A8A8A]">
            Explore other carefully selected properties that match your preferences and lifestyle.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {similarProperties.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No similar properties available at the moment.
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              {/* arrows position like screenshot */}
              <CarouselPrevious className="hidden md:flex -left-6 lg:-left-10 top-1/2 -translate-y-1/2" />
              <CarouselNext className="hidden md:flex -right-6 lg:-right-10 top-1/2 -translate-y-1/2" />

              <CarouselContent className="-ml-6">
                {similarProperties.map((p) => (
                  <CarouselItem
                    key={p._id}
                    className="
                      pl-6
                      basis-[90%]
                      sm:basis-[70%]
                      md:basis-1/2
                      lg:basis-1/3
                      xl:basis-[28%]
                    "
                  >
                    <PropertyCard
                      id={p._id}
                      image={p.images[0] || "/fallback-property.jpg"}
                      title={p.title}
                      location={p.location}
                      price={
                        p.listingType === "For Sale"
                          ? `KSh ${p.price.toLocaleString()}`
                          : `KSh ${p.price.toLocaleString()}/mo`
                      }
                      beds={p.bedrooms}
                      baths={p.bathrooms}
                      acres={p.acres}
                      builtUpSqft={`${p.area} sqm`}
                      plotSqft={p.plot || 0}
                      tagline={p.description.slice(0, 60) + "..."}
                      status={p.listingType as "For Sale" | "For Rent"}
                      availability="Available"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}

export function SimilarPropertiesSkeleton() {
  return (
    <section className="py-16 md:py-16 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <SkeletonLine className="mx-auto h-8 w-60" />
          <SkeletonLine className="mx-auto mt-3 h-4 w-full max-w-xl" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full max-w-[520px] rounded-[28px] bg-[#EAEAEA] p-6"
            >
              <div className="relative overflow-hidden rounded-[24px] border-2 border-[#0B2B4B]">
                <div className="h-[250px] w-full bg-[#DCDCDC] animate-pulse" />
              </div>

              <div className="px-2 pt-5 flex flex-1 flex-col space-y-3">
                <SkeletonLine className="h-5 w-3/4" />
                <SkeletonLine className="h-4 w-2/3" />
                <SkeletonLine className="h-7 w-1/2" />

                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((__, pillIdx) => (
                    <div
                      key={pillIdx}
                      className="h-9 rounded-md bg-[#DCDCDC] animate-pulse"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 2 }).map((__, pillIdx) => (
                    <div
                      key={pillIdx}
                      className="h-9 rounded-md bg-[#DCDCDC] animate-pulse"
                    />
                  ))}
                </div>

                <SkeletonLine className="h-4 w-3/4" />
                <SkeletonLine className="h-12 w-full rounded-full" />
              </div>
            </div>
          ))}
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
