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
  images: string[];
  title?: string;
}

export function PropertyImageGallery({
  images,
  title = "Property",
}: PropertyImageGalleryProps) {
  const validImages = images.filter(Boolean);
  const galleryImages: GalleryImage[] = validImages.map((src, index) => ({
    id: `${index + 1}`,
    src,
    alt: `${title} - Image ${index + 1}`,
  }));

  const [active, setActive] = React.useState(0);
  const [failedImages, setFailedImages] = React.useState<Record<string, boolean>>(
    {}
  );

  const total = galleryImages.length;

  if (total === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-2xl bg-gray-100">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const activeImg = galleryImages[active];
  const activeSrc = failedImages[activeImg.id] ? "/house.png" : activeImg.src;

  const next = () => setActive((p) => (p + 1) % total);
  const prev = () => setActive((p) => (p - 1 + total) % total);

  const thumbsToShow = 7;
  const visibleThumbs = galleryImages.slice(0, thumbsToShow);
  const remaining = Math.max(0, total - thumbsToShow);

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-2xl border border-[#EDEDED] bg-[#F4F6F8] shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="relative h-[260px] sm:h-[380px] md:h-[480px] lg:h-[560px] xl:h-[550px]">
            <Image
              src={activeSrc}
              alt={activeImg.alt}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
              className="object-cover"
              quality={100}
              onError={() =>
                setFailedImages((prevState) => ({
                  ...prevState,
                  [activeImg.id]: true,
                }))
              }
            />

            {total > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-5">
                <Button
                  onClick={prev}
                  type="button"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-white/90 p-0 shadow-md hover:bg-white sm:h-11 sm:w-11"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 text-[#0B1C39] sm:h-6 sm:w-6" />
                </Button>

                <Button
                  onClick={next}
                  type="button"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-white/90 p-0 shadow-md hover:bg-white sm:h-11 sm:w-11"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 text-[#0B1C39] sm:h-6 sm:w-6" />
                </Button>
              </div>
            )}

            {total > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2.5">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActive(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        idx === active
                          ? "scale-125 bg-[#0B1C39]"
                          : "bg-[#D7E6FF]"
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
            <div className="scrollbar-thin flex gap-2.5 overflow-x-auto pb-3 sm:gap-3">
              {visibleThumbs.map((img, idx) => {
                const isActive = idx === active;

                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActive(idx)}
                    className={`relative flex-shrink-0 overflow-hidden rounded-xl border transition-all ${
                      isActive
                        ? "scale-[1.03] border-[#0B1C39] ring-2 ring-[#0B1C39]/20"
                        : "border-[#E5E5E5] hover:border-gray-300"
                    }`}
                    style={{ height: "72px", width: "120px" }}
                    aria-label={`Select ${img.alt}`}
                  >
                    <Image
                      src={failedImages[img.id] ? "/house.png" : img.src}
                      alt={img.alt}
                      fill
                      sizes="120px"
                      className="object-cover"
                      onError={() =>
                        setFailedImages((prevState) => ({
                          ...prevState,
                          [img.id]: true,
                        }))
                      }
                    />
                    <div className="absolute inset-0 bg-black/0 transition hover:bg-black/10" />
                  </button>
                );
              })}

              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => setActive(thumbsToShow)}
                  className="relative flex-shrink-0 overflow-hidden rounded-xl border border-[#E5E5E5]"
                  style={{ height: "72px", width: "120px" }}
                  aria-label={`View ${remaining} more photos`}
                >
                  <Image
                    src={
                      failedImages[galleryImages[thumbsToShow]?.id || ""]
                        ? "/house.png"
                        : galleryImages[thumbsToShow]?.src || galleryImages[0].src
                    }
                    alt="More photos"
                    fill
                    sizes="120px"
                    className="object-cover brightness-75"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-xs font-medium text-white">
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
