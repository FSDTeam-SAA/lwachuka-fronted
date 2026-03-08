// components/skeletons/NearbyPropertySkeleton.tsx
export function NearbyPropertySkeleton() {
  return (
    <div className="rounded-2xl border border-[#E9E9E9] bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] animate-pulse">
      <div className="flex gap-4">
        {/* Image skeleton */}
        <div className="relative h-[80px] w-[80px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-200" />

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-4/5 bg-gray-300 rounded" />
              <div className="h-3 w-3/5 bg-gray-300 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-300 rounded" />
          </div>

          {/* Pills skeleton */}
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded-md" />
            <div className="h-6 w-16 bg-gray-200 rounded-md" />
            <div className="h-6 w-20 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}