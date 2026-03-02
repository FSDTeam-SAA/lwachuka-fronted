import { Shield, Calendar, Lock } from 'lucide-react';

export function WhyChoose() {
  const features = [
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'All properties are verified by our team to ensure authenticity and quality',
    },
    {
      icon: Calendar,
      title: 'Easy Site Visit Booking',
      description: 'Schedule property viewings instantly through our platform with your preferred agents',
    },
    {
      icon: Lock,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with bank-level security',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Why <span className="text-accent">Choose Our</span> Platform?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience the easiest, safest, and most transparent way to find properties in Kenya
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group rounded-xl border border-border bg-white p-8 transition-all hover:shadow-md hover:border-accent/30"
              >
                <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3 text-accent group-hover:bg-accent/20 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
