import Image from "next/image";
import { MapPin, BedDouble, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ---------------- DUMMY DATA ---------------- */

const propertyData = {
  price: "KSH 100,000",
  location: "Nairobi, Karen",
  status: "Available",
  bedrooms: 5,
  bathrooms: 6,
  builtUp: "2,364 sqft",
  plot: "1,550 sqft",
  tagline: "Genuine Resale | End Unit | Luxurious",

  shortDescription:
    "Barnes International Realty is pleased to offer this spectacular 5-bedroom townhouse located in Portofino by Damac, DAMAC Lagoons.",

  details: [
    "Handover SOON",
    "5 bedrooms, 6 bathrooms",
    "BUA: 2,363.75",
    "Mediterranean-inspired villas",
    "All rooms feature double-glazed windows",
    "Ceramic tiled floors throughout",
    "Painted plastered walls and soffit",
    "Fitted kitchen",
    "IMAGES used are the Damac Lagoons Show Unit",
  ],

  longDescription: [
    "Experience the enchanting allure of French-inspired living at Damac Lagoons. With captivating architecture, vibrant hues, and meticulously crafted interiors, our French-style residences evoke the charm of a quaint French cityscape.",
    "Damac Lagoons introduces a new master community in Dubai, drawing inspiration from the Mediterranean. Nestled near the allure of Damac Hills yet secluded from the hustle and bustle.",
    "Spanning over 45 million square feet, Damac Lagoons boasts the epitome of luxury living with its opulent villas and townhouses surrounded by picturesque lagoons.",
    "BARNES is the global leader in luxury real estate offering exceptional properties across international capitals and sought-after destinations.",
  ],

  agent: {
    name: "Rain Altman",
    image: "/agent-profile.jpg",
    expertise:
      "Residential Sales, Residential Leasing, Commercial Sales, Commercial Leasing, Off-Plan Sales",
    serviceArea: "Kenya",
    properties: "36 For Sale",
    experience: "16 years",
  },
};

/* ---------------- COMPONENT ---------------- */

export function PropertyDetailsWithAgentCard() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr] items-start">

          {/* LEFT SIDE */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#061F3D]">
              {propertyData.price}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-base font-medium text-[#1E1E1E]">
              <MapPin className="h-4 w-4" />
              {propertyData.location}
            </div>

            {/* Pills */}
            <div className="mt-5 flex flex-wrap gap-3">

              <Pill active>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0B1C39]" />
                  {propertyData.status}
                </span>
              </Pill>

              <Pill>
                <BedDouble className="h-4 w-4" />
                {propertyData.bedrooms} Bedrooms
              </Pill>

              <Pill>
                <Bath className="h-4 w-4" />
                {propertyData.bathrooms} Bathrooms
              </Pill>

              <Pill>
                <Square className="h-4 w-4" />
                Built-up: {propertyData.builtUp}
              </Pill>

              <Pill>
                <Square className="h-4 w-4" />
                Plot: {propertyData.plot}
              </Pill>

            </div>

            <p className="mt-6 text-lg font-semibold text-[#1E1E1E]">
              {propertyData.tagline}
            </p>

            <p className="mt-6 text-xs sm:text-sm text-[#7D7D7D] leading-6 max-w-4xl">
              {propertyData.shortDescription}
            </p>

            {/* Property Details */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-[#0B1C39] mb-3">
                Property Details:
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-[#8A8A8A]">
                {propertyData.details.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                  
                    - {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Long Description */}
            <div className="mt-8 space-y-5 text-xs sm:text-sm text-[#8A8A8A] leading-6 max-w-4xl">
              {propertyData.longDescription.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE AGENT CARD */}
          <aside className="lg:sticky lg:top-6 w-[400px]">

            <div className="rounded-2xl border border-[#EDEDED] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden">

              <div className="p-6 sm:p-7">

                <div className="flex flex-col items-center text-center">

                  <div className="relative h-[200px] w-[200px] rounded-full overflow-hidden bg-[#F4F6F8]">
                    <Image
                      src={propertyData.agent.image}
                      alt="Agent"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="mt-5 text-2xl font-medium text-[#061F3D]">
                    {propertyData.agent.name}
                  </h3>

                </div>

                <div className="mt-5 space-y-3 text-sm text-[#6F6F6F]">

                  <Row  label="Expertise">
                    {propertyData.agent.expertise}
                  </Row>

                  <Row label="Service Areas">
                    {propertyData.agent.serviceArea}
                  </Row>

                  <Row label="Properties">
                    {propertyData.agent.properties}
                  </Row>

                  <Row label="Experience">
                    {propertyData.agent.experience}
                  </Row>

                </div>

                <Button className="mt-6 w-full h-11 rounded-md bg-[#061F3D] hover:bg-[#061F3D]/90 text-white">
                <span>
                    <Image src="/WhatsApp.png" alt="whatsapp" width={10000} height={1000} className="w-5 h-5" />
                </span>
                  WhatsApp
                </Button>

              </div>
            </div>

          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Pill({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "h-9 px-4 rounded-md border text-xs sm:text-sm inline-flex items-center gap-2 bg-[#F7F8F8]",
        active
          ? "border-[#0B1C39]/40 text-[#0B1C39]"
          : "border-[#E6E6E6] text-[#6F6F6F]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p className="text-sm leading-6">
      <span className="font-bold text-[#1E1E1E]">{label}:</span>{" "}
      <span className="text-[#1E1E1E]">{children}</span>
    </p>
  );
}