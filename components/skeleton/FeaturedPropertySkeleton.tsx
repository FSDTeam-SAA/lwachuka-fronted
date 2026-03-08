// components/skeletons/FeaturedPropertySkeleton.tsx
export function FeaturedPropertySkeleton() {
  return (
    <div className="w-full max-w-[520px] rounded-[28px] bg-[#EAEAEA] p-6 animate-pulse">
      {/* Image skeleton */}
      <div className="relative overflow-hidden rounded-[24px] border-2 border-[#0B2B4B]">
        <div className="h-[250px] w-full bg-gray-300 rounded-[24px]" />
        
        {/* Status badge skeleton */}
        <div className="absolute left-4 top-4 h-8 w-20 rounded-full bg-gray-400" />
      </div>

      {/* Content */}
      <div className="px-2 pt-5 space-y-3">
        <div className="h-6 w-4/5 bg-gray-300 rounded" />
        <div className="h-5 w-3/5 bg-gray-300 rounded" />
        <div className="h-8 w-2/5 bg-gray-300 rounded mt-2" />

        {/* Pills row 1 */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="h-9 bg-gray-300 rounded-[10px]" />
          <div className="h-9 bg-gray-300 rounded-[10px]" />
          <div className="h-9 bg-gray-300 rounded-[10px]" />
        </div>

        {/* Pills row 2 */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="h-9 bg-gray-300 rounded-[10px]" />
          <div className="h-9 bg-gray-300 rounded-[10px]" />
        </div>

        <div className="h-5 w-3/4 bg-gray-300 rounded mt-4" />
        <div className="h-12 w-full bg-gray-400 rounded-full mt-5" />
      </div>
    </div>
  );
}