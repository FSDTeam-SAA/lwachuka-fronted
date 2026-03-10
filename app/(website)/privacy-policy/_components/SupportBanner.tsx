"use client";
import Image from "next/image";

export default function SupportBanner() {
  return (
    <section className=" container mx-auto px-4 md:px-6 lg:px-8 py-6">
      <div className="relative w-full h-[160px] md:h-[200px] lg:h-[275px] rounded-xl overflow-hidden">
        
        {/* Background Image */}
        <Image
          src="/policy1.jpg" 
          alt="Support Banner"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-10">
          <h2 className="text-white text-lg md:text-2xl lg:text-3xl font-semibold">
            Reach Out to Home Finder for Support & Guidance
          </h2>

          <p className="text-white/90 text-xs md:text-sm lg:text-base mt-2 max-w-2xl">
            Our team is ready to assist you with any questions, provide guidance,
            and help you confidently connect with the most suitable assisted
            living facilities for your loved ones.
          </p>
        </div>
      </div>
    </section>
  );
}