import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AgentsSection() {
  const agents = [
    {
      id: 1,
      name: 'Rain Altmann',
      company: 'Prime Properties Kenya',
      image: '/agent-1.jpg',
      listings: 45,
    },
    {
      id: 2,
      name: 'Rain Altmann',
      company: 'Prime Properties Kenya',
      image: '/agent-2.jpg',
      listings: 45,
    },
    {
      id: 3,
      name: 'Rain Altmann',
      company: 'Prime Properties Kenya',
      image: '/agent-3.jpg',
      listings: 45,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Meet <span className="text-accent">Our Top</span> Agents & Vendors
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Work with verified, professional real estate agents to find your perfect property
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-md">
              {/* Image */}
              <div className="relative h-48 w-full md:h-56">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {agent.name}
                </h3>

                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                  {agent.company}
                </div>

                {/* Stats */}
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Listing</span>
                    <span className="font-semibold text-foreground">
                      {agent.listings}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:text-accent/90 p-0 h-auto"
                  >
                    View Profile
                    <span className="ml-2">→</span>
                  </Button>
                </div>

                {/* WhatsApp Button */}
                <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
