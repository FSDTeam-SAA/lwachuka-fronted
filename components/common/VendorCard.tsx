"use client";

import Image from "next/image";
import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface VendorCardProps {
  id: string;
  name: string;
  company: string;
  image: string;
  listings: number;
  role?: "agent" | "vendor";
  advertisementCount?: number;
  phoneNumber?: string;
}

export default function VendorCard({
  id,
  name,
  company,
  role,
  image,
  listings,
  advertisementCount,
  phoneNumber,
}: VendorCardProps) {
  const handleWhatsAppClick = () => {
    const trimmed = phoneNumber?.trim() ?? "";

    if (!trimmed) {
      toast.error("Not available on WhatsApp");
      return;
    }

    const normalized = trimmed.replace(/[^\d+]/g, "");
    const numberForLink = normalized.replace(/^\+/, "");

    if (!numberForLink) {
      toast.error("Not available on WhatsApp");
      return;
    }

    window.open(`https://wa.me/${numberForLink}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#F1F1F1]">
      {/* Image */}
      <div className="relative h-[400px] w-full bg-[#F4F6F8]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-[20px] font-semibold text-[#1E1E1E]">{name}</h3>

        <div className="mt-2 flex items-center gap-2 text-xs text-[#7D7D7D]">
          <Building2 className="h-4 w-4" />
          <span>{company}</span>
        </div>

        {/* Divider */}
        <div className="my-4 h-px w-full bg-[#EAEAEA]" />

        {/* Listing + Profile */}
        <div className="flex items-center justify-between">
          {role== "agent" ?(
              <div className="text-xs text-[#7D7D7D]">
            Listing:{" "}
            <span className="text-[#1E1E1E] font-medium">{listings}</span>
          </div>
          )
          :
          (
              <div className="text-xs text-[#7D7D7D]">
            Advertisement:{" "}
            <span className="text-[#1E1E1E] font-medium">{advertisementCount ?? 0}</span>
          </div>
          )
          }
        
          <Link href={`/vendeor-profile/${id}`}>
          <button className="text-xs font-medium text-[#051E3C] hover:opacity-80 inline-flex items-center gap-2">
            View Profile <ArrowRight className="h-4 w-4" />
          </button>
          </Link>
        </div>

        {/* WhatsApp Button */}
        <Button
          type="button"
          onClick={handleWhatsAppClick}
          className="mt-8 w-full h-11 rounded-lg bg-[#061F3D] hover:bg-[#061F3D]/90 text-white"
        >
          <span className="inline-flex items-center gap-2">
            <Image
              src="/WhatsApp.png"
              alt="WhatsApp"
              width={1000}
              height={1000}
              className="w-5 h-5"
            />
            WhatsApp
          </span>
        </Button>
      </div>
    </div>
  );
}
