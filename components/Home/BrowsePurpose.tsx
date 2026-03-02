import Image from 'next/image';
import { Home, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BrowsePurpose() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Browse <span className="text-accent">by Purpose</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you&apos;re looking to buy your dream home or find the perfect rental, we&apos;ve got you covered
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Buy Properties Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-card shadow-md transition-transform hover:shadow-lg">
            <div className="relative h-64 w-full md:h-72">
              <Image
                src="/buy-property.jpg"
                alt="Buy Properties"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative -mt-32 flex flex-col justify-between px-6 pb-6 pt-32 text-white">
              <div>
                <div className="mb-3 inline-flex rounded-full bg-white/20 p-2 backdrop-blur-sm">
                  <Home className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Buy Properties</h3>
                <p className="mt-2 text-sm text-white/90">
                  Explore over 5,000+ properties for sale across Kenya. From apartments to luxury villas.
                </p>
              </div>

              <Button
                variant="ghost"
                className="mt-6 justify-start text-accent hover:text-accent/90 hover:bg-transparent pl-0"
              >
                Browse Buy Listings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Rent Properties Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-card shadow-md transition-transform hover:shadow-lg">
            <div className="relative h-64 w-full md:h-72">
              <Image
                src="/rent-property.jpg"
                alt="Rent Properties"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative -mt-32 flex flex-col justify-between px-6 pb-6 pt-32 text-white">
              <div>
                <div className="mb-3 inline-flex rounded-full bg-white/20 p-2 backdrop-blur-sm">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Rent Properties</h3>
                <p className="mt-2 text-sm text-white/90">
                  Find your perfect rental home from 3,000+ verified listings. Apartments, houses, and more.
                </p>
              </div>

              <Button
                variant="ghost"
                className="mt-6 justify-start text-accent hover:text-accent/90 hover:bg-transparent pl-0"
              >
                Browse Rent Listings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
