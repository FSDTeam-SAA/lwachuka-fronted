// components/common/VendorCardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function VendorCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#F1F1F1]">
      {/* Image skeleton */}
      <Skeleton className="h-[400px] w-full rounded-none" />

      {/* Content */}
      <div className="p-6">
        <Skeleton className="h-6 w-3/5 rounded" />
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-2/5 rounded" />
        </div>

        <div className="my-4 h-px w-full bg-[#EAEAEA]" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>

        <Skeleton className="mt-8 h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}