import Image from "next/image";
import { Bed, Bath, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteProperty, propertyKeys } from "@/lib/queries/properties";
import { useRouter } from "next/navigation";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  builtUpSqft?: string;
  plotSqft?: number;
  tagline?: string;
  status?: "For Sale" | "For Rent";
  availability?: string;
  id?: string;
  isAgentView?: boolean;
}

import { useState } from "react";
import { DeletePropertyModal } from "@/components/properties/DeletePropertyModal";

export function PropertyCard({
  id,
  image,
  title,
  location,
  price,
  beds,
  baths,
  builtUpSqft = "1,976 sqft",
  plotSqft,
  tagline = "Genuine Resale | End Unit | Luxurious",
  status = "For Sale",
  availability = "Available",
  isAgentView = false,
}: PropertyCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries({ queryKey: propertyKeys.myList() });
      setShowDeleteModal(false);
    },
    onError: () => toast.error("Failed to delete property"),
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (id) deleteMutation.mutate(id);
  };

  return (
    <div className="w-full max-w-[520px] rounded-[28px] bg-[#EAEAEA] p-6 relative">
      {/* Image */}
      <div className="relative overflow-hidden rounded-[24px] border-2 border-[#0B2B4B]">
        <div className="relative h-[250px] w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Status badge */}
        <div className="absolute left-4 top-4 rounded-full bg-[#2F3A46] px-4 py-2 text-sm font-semibold text-white">
          {status}
        </div>

        {/* Delete Overlay for Agent */}
        {isAgentView && (
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="px-2 pt-5">
        <h3 className="text-[18px] font-medium text-[#2E353A]">{title}</h3>

        <div className="mt-2 flex items-center gap-2 text-[15px] font-medium text-[#7B7B7B]">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"
            />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span>{location}</span>
        </div>

        <div className="mt-3 text-[28px] font-semibold text-[#0B2B4B]">
          {price}
        </div>

        {/* Pills row 1 */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Pill variant="active">
            <span className="inline-block h-2 w-2 rounded-full bg-[#0B2B4B]" />
            <span className="ml-2">{availability}</span>
          </Pill>

          <Pill>
            <Bed className="h-4 w-4 text-[#606A74]" />
            <span className="ml-2">{beds} Beds</span>
          </Pill>

          <Pill>
            <Bath className="h-4 w-4 text-[#606A74]" />
            <span className="ml-2">{baths} Baths</span>
          </Pill>
        </div>

        {/* Pills row 2 */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Pill>
            <span className="text-[#606A74]">⌗</span>
            <span className="ml-2">Built-up: {builtUpSqft}</span>
          </Pill>

          <Pill>
            <span className="text-[#606A74]">⧉</span>
            <span className="ml-2">Plot: {plotSqft}</span>
          </Pill>
        </div>

        <p className="mt-4 text-[15px] font-medium text-[#2E353A] line-clamp-1">
          {tagline}
        </p>
        {isAgentView ? (
          <Button
            onClick={() => router.push(`/agent/my-properties/edit/${id}`)}
            className="mt-5 h-12 w-full rounded-full bg-[#0B2B4B] text-white hover:bg-[#0B2B4B]/90 flex items-center justify-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <Link href={`/property-buy/${id}`}>
            <Button className="mt-5 h-12 w-full rounded-full bg-[#0B2B4B] text-white hover:bg-[#0B2B4B]/90">
              View Details 
            </Button>
          </Link>
        )}
      </div>

      <DeletePropertyModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
        title={title}
      />
    </div>
  );
}

function Pill({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "active";
}) {
  return (
    <div
      className={[
        "flex h-9 items-center justify-center rounded-[10px] px-3 text-[12px] font-medium",
        variant === "active"
          ? "border border-[#0B2B4B]/25 bg-white text-[#0B2B4B]"
          : "border border-[#D7D7D7] bg-white text-[#606A74]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}