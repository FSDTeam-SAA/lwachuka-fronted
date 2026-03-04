"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ---------------- DUMMY DATA ---------------- */
const agent = {
  name: "Rain Altmann",
  company: "Prime Properties Kenya",
  photo: "/agent-2.jpg",
  specialty: "Apartment & Condos",
  activeListings: 18,
  phone: "+254 733 234 567",
  email: "rain.w@prime.ke.com",
};

export default function AgentDetailsHero() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="#"
          className="inline-flex items-center gap-2 text-sm text-[#D3920E] hover:opacity-80"
        >
          ← Back to all agents
        </Link>

        {/* Title */}
        <div className="mt-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
            Our Trusted <span className="text-[#D3920E]">Agents & Vendors</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-[#8A8A8A]">
            Connect with experienced professionals to find your perfect property
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[340px_1fr]">
            {/* LEFT PANEL */}
            <div className="relative bg-gradient-to-b from-[#CFE2FF] via-[#8FB2E6] to-[#2C5A93] p-10 flex items-center justify-center">
              {/* big avatar */}
              <div className="relative h-40 w-40 rounded-full ring-4 ring-white/80 overflow-hidden bg-white">
                <Image
                  src={agent.photo}
                  alt={agent.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="p-6 sm:p-10">
              <h2 className="text-2xl font-bold text-[#0B1C39]">
                {agent.name}
              </h2>

              <div className="mt-1 flex items-center gap-2 text-sm text-[#8A8A8A]">
                <Building2 className="h-4 w-4" />
                <span>{agent.company}</span>
              </div>

              {/* Info boxes */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-[#EFF2F6] px-5 py-4">
                  <p className="text-sm text-[#7D7D7D]">Specialty</p>
                  <p className="mt-1 text-base font-semibold text-[#051E3C]">
                    {agent.specialty}
                  </p>
                </div>

                <div className="rounded-xl bg-[#EFF2F6] px-5 py-4">
                  <p className="text-sm text-[#7D7D7D]">Active Listings</p>
                  <p className="mt-1 text-base font-semibold text-[#051E3C]">
                    {agent.activeListings}
                  </p>
                </div>
              </div>

              {/* Contact details */}
              <div className="mt-6 space-y-3 text-base text-[#7D7D7D]">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#0B1C39]" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#0B1C39]" />
                  <span>{agent.email}</span>
                </div>
              </div>

              {/* Button */}
              <Button className="mt-7 h-11 px-8 rounded-md bg-[#061F3D] hover:bg-[#061F3D]/90 text-white">
                Contact Agent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}