import Image from 'next/image';
import { Eye } from 'lucide-react';

export function Advertisements() {
  const ads = [
    {
      id: 1,
      title: 'Premium Moving Services',
      subtitle: 'Banner',
      image: '/ad-banner.jpg',
      views: 3421,
      description: 'MOVING SERVICE - LEAVE EVERYTHING IN OUR EXPERT HANDS!',
      details: [
        'Long Distance Moves',
        'Packing Your Home',
        'Affordable Services',
        'Experienced Workers',
      ],
      discount: '40% OFF',
      discountText: 'On First Order',
    },
    {
      id: 2,
      title: 'Premium Moving Services',
      subtitle: 'Banner',
      image: '/ad-banner.jpg',
      views: 3421,
      description: 'MOVING SERVICE - LEAVE EVERYTHING IN OUR EXPERT HANDS!',
      details: [
        'Long Distance Moves',
        'Packing Your Home',
        'Affordable Services',
        'Experienced Workers',
      ],
      discount: '40% OFF',
      discountText: 'On First Order',
    },
    {
      id: 3,
      title: 'Premium Moving Services',
      subtitle: 'Banner',
      image: '/ad-banner.jpg',
      views: 3421,
      description: 'MOVING SERVICE - LEAVE EVERYTHING IN OUR EXPERT HANDS!',
      details: [
        'Long Distance Moves',
        'Packing Your Home',
        'Affordable Services',
        'Experienced Workers',
      ],
      discount: '40% OFF',
      discountText: 'On First Order',
    },
    {
      id: 4,
      title: 'Premium Moving Services',
      subtitle: 'Banner',
      image: '/ad-banner.jpg',
      views: 3421,
      description: 'MOVING SERVICE - LEAVE EVERYTHING IN OUR EXPERT HANDS!',
      details: [
        'Long Distance Moves',
        'Packing Your Home',
        'Affordable Services',
        'Experienced Workers',
      ],
      discount: '40% OFF',
      discountText: 'On First Order',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Our <span className="text-accent">Advertisements</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience the easiest, safest, and most transparent way to find properties in Kenya
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
            >
              {/* Ad Image */}
              <div className="relative h-40 w-full overflow-hidden bg-muted">
                <Image
                  src={ad.image}
                  alt={ad.title}
                  fill
                  className="object-cover"
                />

                {/* Discount Badge */}
                <div className="absolute left-3 top-3 inline-flex flex-col items-center rounded-lg bg-primary/90 px-2 py-1 text-center">
                  <span className="text-lg font-bold text-white leading-tight">
                    {ad.discount}
                  </span>
                  <span className="text-xs text-white/90 leading-tight">
                    {ad.discountText}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-primary">
                  {ad.description}
                </h3>

                {/* Details List */}
                <ul className="mt-3 space-y-1 text-xs text-foreground">
                  {ad.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="mt-4 border-t border-border pt-3">
                  <p className="font-semibold text-foreground text-sm">
                    {ad.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{ad.subtitle}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{ad.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
