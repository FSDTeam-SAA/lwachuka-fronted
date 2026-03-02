import Image from 'next/image';
import { Bed, Bath, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LocationExplorer() {
  const properties = [
    {
      id: 1,
      title: 'Modern 2BR Apartment',
      location: 'Westland\'s, Nairobi',
      price: 'KSh 85,000/mo',
      beds: 2,
      baths: 1,
      sqft: '900m²',
      image: '/location-property-1.jpg',
    },
    {
      id: 2,
      title: 'Cozy Studio Flat',
      location: 'Kilimani, Nairobi',
      price: 'KSh 45,000/mo',
      beds: 1,
      baths: 1,
      sqft: '380m²',
      image: '/location-property-2.jpg',
    },
    {
      id: 3,
      title: 'Spacious 3BR Townhouse',
      location: 'Karen, Nairobi',
      price: 'KSh 120,000/mo',
      beds: 3,
      baths: 2,
      sqft: '1500m²',
      image: '/location-property-3.jpg',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Explore Properties by <span className="text-accent">Location</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Use our interactive map to discover properties in your preferred neighborhoods
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Map Section */}
          <div className="relative h-96 overflow-hidden rounded-2xl bg-muted md:h-full min-h-[500px]">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex rounded-full bg-primary/20 p-4 mb-4">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Nairobi, Kenya</p>
                <p className="text-xs text-muted-foreground mt-1">Interactive Map Coming Soon</p>
              </div>
            </div>

            {/* Map Markers */}
            <div className="absolute inset-0">
              <div className="absolute left-1/4 top-1/3 flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
              </div>
              <div className="absolute right-1/3 top-1/2 flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-accent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Nearby Properties
            </h3>

            {properties.map((property) => (
              <div
                key={property.id}
                className="flex gap-4 rounded-lg border border-border bg-white p-4 transition-all hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm">
                    {property.title}
                  </h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                    {property.location}
                  </p>

                  {/* Features */}
                  <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {property.beds}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {property.baths}
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="h-3 w-3" />
                      {property.sqft}
                    </div>
                  </div>

                  <p className="mt-2 font-semibold text-accent text-sm">
                    {property.price}
                  </p>
                </div>
              </div>
            ))}

            <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
              See All
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
