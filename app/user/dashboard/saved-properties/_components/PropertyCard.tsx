


// "use client";

// import Image from "next/image";
// import { Bath, Bed, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// interface PropertyCardProps {
//   id: string;
//   bookmarkId?: string;
//   image: string;
//   title: string;
//   location: string;
//   price: string;
//   beds: number;
//   baths: number;
//   status?: "For Sale" | "For Rent";
//   tagline?: string;
//   availability?: string;
//   onDelete?: (bookmarkId: string) => Promise<void> | void;
//   isDeleting?: boolean;
// }

// export default function PropertyCard({
//   id,
//   bookmarkId,
//   image,
//   title,
//   location,
//   price,
//   beds,
//   baths,
//   status = "For Sale",
//   tagline = "Premium property listing",
//   availability = "Available",
//   onDelete,
//   isDeleting = false,
// }: PropertyCardProps) {
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   console.log("dsfasdf", image)
  

//   const canDelete = Boolean(onDelete && bookmarkId);

//   const handleConfirmDelete = async () => {
//     if (!onDelete || !bookmarkId) return;

//     try {
//       await onDelete(bookmarkId);
//       setConfirmOpen(false);
//     } catch {
//       // keep dialog open if delete fails
//     }
//   };

//   return (
//     <div className="w-full overflow-hidden rounded-[28px] bg-[#EAEAEA] p-4 sm:p-6">
//       {/* Image + badge */}
//       <div className="relative overflow-hidden rounded-[24px] border-2 border-[#0B2B4B]">
//         <div className="relative h-[220px] w-full sm:h-[250px]">
//           <Image
//             src={image}
//             alt={title}
//             fill
//             className="object-cover"
//             sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
//           />
//         </div>

//         <div className="absolute left-4 top-4 rounded-full bg-[#2F3A46] px-4 py-2 text-xs font-semibold text-white sm:text-sm">
//           {status}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="px-1 pt-5 sm:px-2">
//         <h3 className="line-clamp-2 text-[18px] font-medium text-[#2E353A]">
//           {title}
//         </h3>

//         <p className="mt-2 line-clamp-1 text-[15px] font-medium text-[#7B7B7B]">
//           {location}
//         </p>

//         <div className="mt-3 break-words text-[24px] font-semibold text-[#0B2B4B] sm:text-[28px]">
//           {price}
//         </div>

//         {/* Info row */}
//         <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
//           <div className="flex items-center justify-center rounded-md border bg-white px-3 py-2 text-center">
//             {availability}
//           </div>

//           <div className="flex items-center justify-center gap-1 rounded-md border bg-white px-3 py-2">
//             <Bed className="h-4 w-4 shrink-0" />
//             <span>{beds}</span>
//           </div>

//           <div className="flex items-center justify-center gap-1 rounded-md border bg-white px-3 py-2">
//             <Bath className="h-4 w-4 shrink-0" />
//             <span>{baths}</span>
//           </div>
//         </div>

//         <p className="mt-4 line-clamp-2 min-h-[40px] text-[14px] text-[#2E353A]">
//           {tagline}
//         </p>

//         {/* Actions */}
//         <div className="mt-5 flex items-center gap-3">
//           <Link href={`/property-buy/${id}`} className="flex-1">
//             <Button className="h-12 w-full rounded-full bg-[#0B2B4B] text-white hover:bg-[#0B2B4B]/90">
//               View Details
//             </Button>
//           </Link>

//           <Dialog
//             open={confirmOpen}
//             onOpenChange={(open) => {
//               if (!isDeleting) setConfirmOpen(open);
//             }}
//           >
//             <DialogTrigger asChild>
//               <button
//                 type="button"
//                 disabled={!canDelete || isDeleting}
//                 className="flex h-12 w-12 items-center justify-center rounded-full border bg-white transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
//                 aria-label="Remove from bookmarks"
//               >
//                 <Trash2 className="h-5 w-5 text-red-500" />
//               </button>
//             </DialogTrigger>

//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Remove bookmark?</DialogTitle>
//                 <DialogDescription>
//                   This property will be removed from your saved list.
//                 </DialogDescription>
//               </DialogHeader>

//               <DialogFooter className="flex gap-2 sm:justify-end">
//                 <DialogClose asChild>
//                   <Button variant="outline" disabled={isDeleting}>
//                     Cancel
//                   </Button>
//                 </DialogClose>

//                 <Button onClick={handleConfirmDelete} disabled={isDeleting}>
//                   {isDeleting ? "Removing..." : "Yes, remove"}
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import Image from "next/image";
import { Bath, Bed, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PropertyCardProps {
  id: string;
  propertyId?: string;
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  status?: "For Sale" | "For Rent";
  tagline?: string;
  availability?: string;
  onDelete?: (propertyId: string) => Promise<void> | void;
  isDeleting?: boolean;
}

export default function PropertyCard({
  id,
  propertyId,
  image,
  title,
  location,
  price,
  beds,
  baths,
  status = "For Sale",
  tagline = "Premium property listing",
  availability = "Available",
  onDelete,
  isDeleting = false,
}: PropertyCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canDelete = Boolean(onDelete && propertyId);

  const handleConfirmDelete = async () => {
    if (!onDelete || !propertyId) return;

    try {
      await onDelete(propertyId);
      setConfirmOpen(false);
    } catch {
      // keep dialog open if delete fails
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-[28px] bg-[#EAEAEA] p-4 sm:p-6">
      <div className="relative overflow-hidden rounded-[24px] border-2 border-[#0B2B4B]">
        <div className="relative h-[220px] w-full sm:h-[250px]">
          <Image
            src={image || "/placeholder-property.jpg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>

        <div className="absolute left-4 top-4 rounded-full bg-[#2F3A46] px-4 py-2 text-xs font-semibold text-white sm:text-sm">
          {status}
        </div>
      </div>

      <div className="px-1 pt-5 sm:px-2">
        <h3 className="line-clamp-2 text-[18px] font-medium text-[#2E353A]">
          {title}
        </h3>

        <p className="mt-2 line-clamp-1 text-[15px] font-medium text-[#7B7B7B]">
          {location}
        </p>

        <div className="mt-3 break-words text-[24px] font-semibold text-[#0B2B4B] sm:text-[28px]">
          {price}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
          <div className="flex items-center justify-center rounded-md border bg-white px-3 py-2 text-center">
            {availability}
          </div>

          <div className="flex items-center justify-center gap-1 rounded-md border bg-white px-3 py-2">
            <Bed className="h-4 w-4 shrink-0" />
            <span>{beds}</span>
          </div>

          <div className="flex items-center justify-center gap-1 rounded-md border bg-white px-3 py-2">
            <Bath className="h-4 w-4 shrink-0" />
            <span>{baths}</span>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 min-h-[40px] text-[14px] text-[#2E353A]">
          {tagline}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <Link href={`/property-buy/${id}`} className="flex-1">
            <Button className="h-12 w-full rounded-full bg-[#0B2B4B] text-white hover:bg-[#0B2B4B]/90">
              View Details
            </Button>
          </Link>

          <Dialog
            open={confirmOpen}
            onOpenChange={(open) => {
              if (!isDeleting) setConfirmOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <button
                type="button"
                disabled={!canDelete || isDeleting}
                className="flex h-12 w-12 items-center justify-center rounded-full border bg-white transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Remove from bookmarks"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Remove bookmark?</DialogTitle>
                <DialogDescription>
                  This property will be removed from your saved list.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex gap-2 sm:justify-end">
                <DialogClose asChild>
                  <Button variant="outline" disabled={isDeleting}>
                    Cancel
                  </Button>
                </DialogClose>

                <Button onClick={handleConfirmDelete} disabled={isDeleting}>
                  {isDeleting ? "Removing..." : "Yes, remove"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
