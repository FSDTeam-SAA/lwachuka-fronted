import { Shield, CalendarDays, Lock } from "lucide-react";

export function WhyChoosePlatform() {
  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description:
        "All properties are verified by our team to ensure authenticity and quality",
    },
    {
      icon: CalendarDays,
      title: "Easy Site Visit Booking",
      description:
        "Schedule property viewings instantly through our platform with your preferred agents",
    },
    {
      icon: Lock,
      title: "Secure Platform",
      description:
        "Your data and transactions are protected with bank-level security",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
            Why <span className="text-[#D3920E]">Choose Our</span> Platform?
          </h2>
          <p className="mt-3 text-xs md:text-sm text-[#8A8A8A]">
            Experience the easiest, safest, and most transparent way to find properties in Kenya
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#EDEDED] bg-white px-7 py-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#D3920E]/40 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]"
              >
                {/* Icon box */}
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF3EE]">
                  <Icon className="h-5 w-5 text-[#0B1C39]" />
                </div>

                <h3 className="text-2xl font-semibold text-[#1E1E1E]">
                  {item.title}
                </h3>

                <p className="mt-5 text-base leading-5 text-[#7D7D7D]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
