
"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
};

interface PropertyImageGalleryProps {
  images: string[];           // comes from API
  title?: string;             // used for alt text
}

export function PropertyImageGallery({ images, title = "Property" }: PropertyImageGalleryProps) {
  // Transform API image URLs into typed array
  const galleryImages: GalleryImage[] = images.map((src, index) => ({
    id: `${index + 1}`,
    src,
    alt: `${title} - Image ${index + 1}`,
  }));

  const [active, setActive] = React.useState(0);

  const total = galleryImages.length;
  if (total === 0) {
    return (
      <div className="w-full h-80 bg-gray-100 flex items-center justify-center rounded-2xl">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const activeImg = galleryImages[active];

  const next = () => setActive((p) => (p + 1) % total);
  const prev = () => setActive((p) => (p - 1 + total) % total);

  // Thumbnails: show max 7 + "more" tile
  const thumbsToShow = 7;
  const visibleThumbs = galleryImages.slice(0, thumbsToShow);
  const remaining = Math.max(0, total - thumbsToShow);

  return (
    <section className="w-full">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-2xl bg-[#F4F6F8] border border-[#EDEDED] shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="relative h-[260px] sm:h-[380px] md:h-[480px] lg:h-[560px] xl:h-[620px]">
            <Image
              src={activeImg.src}
              alt={activeImg.alt}
              width={1000}
              height={1000}
              priority
              className="object-cover w-full h-full"
            
            />

            {/* Arrows */}
            {total > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-5">
                <Button
                  onClick={prev}
                  variant="secondary"
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full p-0 bg-white/90 hover:bg-white shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-[#0B1C39]" />
                </Button>

                <Button
                  onClick={next}
                  variant="secondary"
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full p-0 bg-white/90 hover:bg-white shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-[#0B1C39]" />
                </Button>
              </div>
            )}

            {/* Dots */}
            {total > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2.5">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActive(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        idx === active ? "bg-[#0B1C39] scale-125" : "bg-[#D7E6FF]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {total > 1 && (
          <div className="mt-4 md:mt-5">
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-3 scrollbar-thin">
              {visibleThumbs.map((img, idx) => {
                const isActive = idx === active;
                return (
                  <button
                    key={img.id}
                    onClick={() => setActive(idx)}
                    className={`relative flex-shrink-0 overflow-hidden rounded-xl border transition-all ${
                      isActive
                        ? "border-[#0B1C39] ring-2 ring-[#0B1C39]/20 scale-[1.03]"
                        : "border-[#E5E5E5] hover:border-gray-300"
                    }`}
                    style={{
                      height: "72px",
                      width: "120px",
                    }}
                    aria-label={`Select ${img.alt}`}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />
                  </button>
                );
              })}

              {remaining > 0 && (
                <button
                  onClick={() => setActive(thumbsToShow)}
                  className="relative flex-shrink-0 overflow-hidden rounded-xl border border-[#E5E5E5]"
                  style={{
                    height: "72px",
                    width: "120px",
                  }}
                  aria-label={`View ${remaining} more photos`}
                >
                  <Image
                    src={galleryImages[thumbsToShow]?.src || galleryImages[0].src}
                    alt="More photos"
                    fill
                    className="object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs font-medium">
                    <span>+{remaining}</span>
                    <span>more</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}