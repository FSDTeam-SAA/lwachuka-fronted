import Image from "next/image";
import Link from "next/link";
import { Home, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BrowsePurpose() {
  return (
    <section className="py-20 bg-[#F8F9FB]">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
            Browse <span className="text-[#D3920E]">by</span> Purpose
          </h2>
          <p className="mt-4 text-[#6C6C6C]">
            Whether you&apos;`re looking to buy your dream home or find the perfect rental, we&apos;`ve got you covered
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Buy Card */}
          <div className="relative h-[460px] rounded-2xl overflow-hidden group">
            {/* Background Image */}
            <Image
              src="/browse1.jpg"
              alt="Buy Properties"
              fill
              priority
              className="object-cover group-hover:scale-105 transition duration-500"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061F3D]/80 via-[#061F3D]/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
              <div>
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-md">
                  <Home className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-semibold mb-3">
                  Rent Properties
                </h3>

                <p className="max-w-sm text-white/90">
                  Explore over 5,000+ properties for sale across Kenya. From apartments to luxury villas.
                </p>
              </div>

              {/* Button */}
              <div>
                <Button
                  asChild
                  className="w-[500px] bg-white text-[#D3920E] hover:bg-white/90 rounded-full h-14 text-base font-medium flex items-center justify-between px-6"
                >
                  <Link href="/properties?tab=rent">
                    Browse Rent Listings
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Rent Card */}
          <div className="relative h-[460px] rounded-2xl overflow-hidden group">
            <Image
              src="/browse2.jpg"
              alt="Rent Properties"
              fill
              priority
              className="object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#061F3D]/80 via-[#061F3D]/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
              <div>
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-md">
                  <Building2 className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-semibold mb-3">
                 Sale Properties
                </h3>

                <p className="max-w-sm text-white/90">
                  Find your perfect rental home from 3,000+ verified listings. Apartments, houses, and more.
                </p>
              </div>

              <div>
                <Button
                  asChild
                  className="w-[500px] bg-white text-[#D3920E] hover:bg-white/90 rounded-full h-14 text-base font-medium flex items-center justify-between px-6"
                >
                  <Link href="/properties?tab=sale">
                    Browse Sale Listings
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
