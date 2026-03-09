"use client";

import Image from "next/image";
import { Bed, Bath, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PropertyCardProps {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  builtUpSqft?: string;
  plotSqft?: string;
  tagline?: string;
  status?: "For Sale" | "For Rent";
  availability?: string;
  onDelete?: (id: number) => void;
}

export default function PropertyCard({
  id,
  image,
  title,
  location,
  price,
  beds,
  baths,
  tagline = "Genuine Resale | End Unit | Luxurious",
  status = "For Sale",
  availability = "Available",
  onDelete,
}: PropertyCardProps) {
  return (
    <div className="w-full max-w-[520px] rounded-[28px] bg-[#EAEAEA] p-6">
      
      {/* Image */}
      <div className="relative overflow-hidden rounded-[24px] border-2 border-[#0B2B4B]">
        <div className="relative h-[250px] w-full">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>

        <div className="absolute left-4 top-4 rounded-full bg-[#2F3A46] px-4 py-2 text-sm font-semibold text-white">
          {status}
        </div>
      </div>

      {/* Body */}
      <div className="px-2 pt-5">
        <h3 className="text-[18px] font-medium text-[#2E353A]">{title}</h3>

        <p className="mt-2 text-[15px] font-medium text-[#7B7B7B]">
          {location}
        </p>

        <div className="mt-3 text-[28px] font-semibold text-[#0B2B4B]">
          {price}
        </div>

        {/* Info Row */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
          <div className="flex items-center justify-center rounded-md border bg-white px-3 py-2">
            {availability}
          </div>

          <div className="flex items-center justify-center gap-1 rounded-md border bg-white px-3 py-2">
            <Bed className="h-4 w-4" /> {beds}
          </div>

          <div className="flex items-center justify-center gap-1 rounded-md border bg-white px-3 py-2">
            <Bath className="h-4 w-4" /> {baths}
          </div>
        </div>

        <p className="mt-4 text-[14px] text-[#2E353A]">{tagline}</p>

        {/* Button + Delete */}
        <div className="mt-5 flex items-center gap-3">
          <Link href={`/property-buy/${id}`} className="flex-1">
            <Button className="h-12 w-full rounded-full bg-[#0B2B4B] text-white">
              View Details
            </Button>
          </Link>

          <button
            onClick={() => onDelete?.(id)}
            className="flex h-12 w-12 items-center justify-center rounded-full border bg-white hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}