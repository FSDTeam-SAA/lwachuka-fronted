// "use client";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { BookmarkX, Loader2, AlertCircle } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { useMemo, useState } from "react";
// import PropertyCard from "./_components/PropertyCard";

// // ────────────────────────────────────────────────
// // Types (matching your real API)
// // ────────────────────────────────────────────────

// interface Property {
//   _id: string;
//   title: string;
//   listingType: "For Sale" | "For Rent";
//   propertyType?: string;
//   bedrooms: number;
//   bathrooms: number;
//   area?: number;
//   plot?: number;
//   builtUp?: number;
//   description?: string;
//   location: string;
//   price: number;
//   images: string[];
//   status?: string;
//   purpose?: string;
//   furnishing?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   // ... other fields you may use later
// }

// interface Bookmark {
//   _id: string;
//   property: Property | null;
//   user: any; // you can type it better if needed
//   createdAt: string;
//   updatedAt?: string;
// }

// interface ApiResponse {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   meta: {
//     total: number;
//     limit: number;
//     page: number;
//   };
//   data: Bookmark[];
//   responseTime?: string;
// }

// // ────────────────────────────────────────────────
// // API Functions
// // ────────────────────────────────────────────────

// const fetchBookmarks = async (token: string): Promise<ApiResponse> => {
//   const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
//   if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_BACKEND_API_URL");

//   const { data } = await axios.get<ApiResponse>(`${baseUrl}/bookmark?sortOrder=desc`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return data;
// };

// const deleteBookmark = async (bookmarkId: string, token: string) => {
//   const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
//   if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_BACKEND_API_URL");

//   await axios.delete(`${baseUrl}/bookmark/${bookmarkId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // ────────────────────────────────────────────────
// // Formatters
// // ────────────────────────────────────────────────

// function formatPriceKES(price: number, listingType: "For Sale" | "For Rent"): string {
//   if (listingType === "For Rent") {
//     return `KES ${price.toLocaleString("en-US")}/mo`;
//   }

//   // For Sale → show in KES or M
//   if (price >= 1_000_000) {
//     const millions = price / 1_000_000;
//     return `KES ${millions.toFixed(millions % 1 === 0 ? 0 : 1)}M`;
//   }

//   return `KES ${price.toLocaleString("en-US")}`;
// }

// function getTagline(property: Property): string {
//   const parts: string[] = [];

//   if (property.propertyType) parts.push(property.propertyType);
//   if (property.area) parts.push(`${property.area} sqm`);
//   if (property.builtUp) parts.push(`Built-up ${property.builtUp} sqm`);
//   if (property.plot) parts.push(`Plot ${property.plot} sqm`);

//   return parts.length > 0 ? parts.join(" • ") : "Premium property";
// }

// // ────────────────────────────────────────────────
// // Skeleton
// // ────────────────────────────────────────────────

// function PropertyCardSkeleton() {
//   return (
//     <div className="w-full overflow-hidden rounded-[28px] bg-[#EAEAEA] p-4 sm:p-6">
//       <div className="h-[220px] sm:h-[250px] w-full rounded-[24px] bg-gray-300 animate-pulse" />
//       <div className="pt-5 space-y-3 px-1 sm:px-2">
//         <div className="h-6 w-4/5 bg-gray-300 rounded animate-pulse" />
//         <div className="h-4 w-3/5 bg-gray-300 rounded animate-pulse" />
//         <div className="h-7 w-1/3 bg-gray-300 rounded animate-pulse" />
//         <div className="grid grid-cols-3 gap-3">
//           {Array(3)
//             .fill(0)
//             .map((_, i) => (
//               <div key={i} className="h-9 bg-gray-300 rounded animate-pulse" />
//             ))}
//         </div>
//         <div className="h-10 w-full bg-gray-300 rounded animate-pulse mt-3" />
//       </div>
//     </div>
//   );
// }

// // ────────────────────────────────────────────────
// // Main Component
// // ────────────────────────────────────────────────

// export default function BookmarksPage() {
//   const { data: session, status } = useSession();
//   const token = session?.user?.accessToken as string | undefined;
//   const queryClient = useQueryClient();

//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     isFetching,
//   } = useQuery({
//     queryKey: ["bookmarks", token],
//     queryFn: () => fetchBookmarks(token!),
//     enabled: !!token && status === "authenticated",
//     staleTime: 2 * 60 * 1000, // 2 minutes
//     gcTime: 5 * 60 * 1000,
//     retry: 1,
//   });

//   const visibleBookmarks = useMemo(() => {
//     return (data?.data ?? []).filter(
//       (b): b is Bookmark & { property: Property } => !!b.property
//     );
//   }, [data]);

//   const deleteMutation = useMutation({
//     mutationFn: (bookmarkId: string) => deleteBookmark(bookmarkId, token!),

//     onMutate: async (bookmarkId) => {
//       // Optimistic update
//       await queryClient.cancelQueries({ queryKey: ["bookmarks", token] });
//       const previous = queryClient.getQueryData<ApiResponse>(["bookmarks", token]);

//       queryClient.setQueryData<ApiResponse>(["bookmarks", token], (old) => {
//         if (!old) return old;
//         return {
//           ...old,
//           data: old.data.filter((b) => b._id !== bookmarkId),
//           meta: {
//             ...old.meta,
//             total: old.meta.total - 1,
//           },
//         };
//       });

//       return { previous };
//     },

//     onError: (err, bookmarkId, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(["bookmarks", token], context.previous);
//       }
//       const msg = axios.isAxiosError(err)
//         ? err.response?.data?.message ?? "Failed to remove bookmark"
//         : "Something went wrong";
//       toast.error(msg);
//     },

//     onSuccess: () => {
//       toast.success("Bookmark removed");
//       // Background refetch will happen automatically
//     },

//     onSettled: () => {
//       setDeletingId(null);
//     },
//   });

//   const handleDelete = (bookmarkId: string) => {
//     setDeletingId(bookmarkId);
//     deleteMutation.mutate(bookmarkId);
//   };

//   // ─── States ─────────────────────────────────────────────

//   if (status === "loading") {
//     return (
//       <div className="container mx-auto py-20 flex justify-center items-center gap-3 text-muted-foreground">
//         <Loader2 className="h-6 w-6 animate-spin" />
//         <span>Loading session...</span>
//       </div>
//     );
//   }

//   if (!token || status !== "authenticated") {
//     return (
//       <div className="container mx-auto py-16">
//         <div className="rounded-2xl border bg-card p-10 text-center max-w-lg mx-auto">
//           <BookmarkX className="mx-auto h-14 w-14 text-muted-foreground/70" />
//           <h2 className="mt-5 text-2xl font-semibold">Not logged in</h2>
//           <p className="mt-3 text-muted-foreground">
//             Sign in to see and manage your saved properties.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="mb-8 text-3xl font-bold tracking-tight">My Bookmarks</h1>
//         <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <PropertyCardSkeleton key={i} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     const errMsg =
//       axios.isAxiosError(error) && error.response?.data?.message
//         ? error.response.data.message
//         : "Could not load bookmarks. Please try again later.";

//     return (
//       <div className="container mx-auto py-20 text-center">
//         <AlertCircle className="mx-auto h-14 w-14 text-red-500" />
//         <h2 className="mt-5 text-2xl font-semibold">Something went wrong</h2>
//         <p className="mt-3 text-muted-foreground">{errMsg}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">My Bookmarks</h1>
//           <p className="mt-1.5 text-sm text-muted-foreground">
//             {visibleBookmarks.length} saved propert
//             {visibleBookmarks.length === 1 ? "y" : "ies"}
//             {isFetching ? " • updating..." : ""}
//           </p>
//         </div>
//       </div>

//       {visibleBookmarks.length === 0 ? (
//         <div className="rounded-2xl border bg-card p-12 text-center max-w-2xl mx-auto">
//           <h2 className="text-2xl font-semibold">No bookmarks yet</h2>
//           <p className="mt-3 text-muted-foreground">
//             Properties you save will appear here. Start exploring!
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
//           {visibleBookmarks.map((bookmark) => {
//             const prop = bookmark.property;
//             const firstImage = prop.images?.[0] || "/placeholder-property.jpg";

//             return (
//               <PropertyCard
//                 key={bookmark._id}
//                 id={prop._id}
//                 bookmarkId={bookmark._id}
//                 image={firstImage}
//                 title={prop.title}
//                 location={prop.location}
//                 price={formatPriceKES(prop.price, prop.listingType)}
//                 beds={prop.bedrooms}
//                 baths={prop.bathrooms}
//                 status={prop.listingType}
//                 tagline={getTagline(prop)}
//                 availability="Available"
//                 onDelete={handleDelete}
//                 isDeleting={deletingId === bookmark._id}
//               />
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }






"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { BookmarkX, Loader2, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import PropertyCard from "./_components/PropertyCard";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

interface Property {
  _id: string;
  title: string;
  listingType: "For Sale" | "For Rent";
  propertyType?: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  plot?: number;
  builtUp?: number;
  description?: string;
  location: string;
  price: number;
  images: string[];
  status?: string;
  purpose?: string;
  furnishing?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Bookmark {
  _id: string;
  property: Property | null;
  user: unknown;
  createdAt: string;
  updatedAt?: string;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    limit: number;
    page: number;
  };
  data: Bookmark[];
  responseTime?: string;
}

interface ApiErrorResponse {
  message?: string;
}

// ────────────────────────────────────────────────
// API Functions
// ────────────────────────────────────────────────

const fetchBookmarks = async (token: string): Promise<ApiResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_API_URL");
  }

  const { data } = await axios.get<ApiResponse>(`${baseUrl}/bookmark?sortOrder=desc`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

const deleteBookmark = async (propertyId: string, token: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_API_URL");
  }

  const { data } = await axios.delete(`${baseUrl}/bookmark/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

function formatPriceKES(price: number, listingType: "For Sale" | "For Rent"): string {
  if (listingType === "For Rent") {
    return `KES ${price.toLocaleString("en-US")}/mo`;
  }

  if (price >= 1_000_000) {
    const millions = price / 1_000_000;
    return `KES ${millions.toFixed(millions % 1 === 0 ? 0 : 1)}M`;
  }

  return `KES ${price.toLocaleString("en-US")}`;
}

function getTagline(property: Property): string {
  const parts: string[] = [];

  if (property.propertyType) parts.push(property.propertyType);
  if (property.area) parts.push(`${property.area} sqm`);
  if (property.builtUp) parts.push(`Built-up ${property.builtUp} sqm`);
  if (property.plot) parts.push(`Plot ${property.plot} sqm`);

  return parts.length > 0 ? parts.join(" • ") : "Premium property";
}

// ────────────────────────────────────────────────
// Skeleton
// ────────────────────────────────────────────────

function PropertyCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-[28px] bg-[#EAEAEA] p-4 sm:p-6">
      <div className="h-[220px] w-full animate-pulse rounded-[24px] bg-gray-300 sm:h-[250px]" />
      <div className="space-y-3 px-1 pt-5 sm:px-2">
        <div className="h-6 w-4/5 animate-pulse rounded bg-gray-300" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-gray-300" />
        <div className="h-7 w-1/3 animate-pulse rounded bg-gray-300" />

        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded bg-gray-300" />
          ))}
        </div>

        <div className="mt-3 h-10 w-full animate-pulse rounded bg-gray-300" />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const token = session?.user?.accessToken as string | undefined;
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryKey = ["bookmarks", token];

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<ApiResponse, AxiosError<ApiErrorResponse>>({
    queryKey,
    queryFn: () => fetchBookmarks(token as string),
    enabled: Boolean(token) && status === "authenticated",
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  const visibleBookmarks = useMemo(() => {
    return (data?.data ?? []).filter(
      (item): item is Bookmark & { property: Property } => Boolean(item.property)
    );
  }, [data]);

  const deleteMutation = useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    string,
    { previousData?: ApiResponse }
  >({
    mutationFn: async (propertyId: string) => {
      if (!token) {
        throw new Error("Missing access token");
      }

      return deleteBookmark(propertyId, token);
    },

    onMutate: async (propertyId) => {
      setDeletingId(propertyId);

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<ApiResponse>(queryKey);

      queryClient.setQueryData<ApiResponse>(queryKey, (old) => {
        if (!old) return old;

        const filtered = old.data.filter((item) => item.property?._id !== propertyId);

        return {
          ...old,
          data: filtered,
          meta: {
            ...old.meta,
            total: Math.max(0, filtered.length),
          },
        };
      });

      return { previousData };
    },

    onError: (err, _propertyId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      const message =
        err.response?.data?.message || err.message || "Failed to remove bookmark";

      toast.error(message);
    },

    onSuccess: () => {
      toast.success("Bookmark removed");
    },

    onSettled: async () => {
      setDeletingId(null);
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleDelete = async (propertyId: string) => {
    await deleteMutation.mutateAsync(propertyId);
  };

  // ────────────────────────────────────────────────
  // States
  // ────────────────────────────────────────────────

  if (status === "loading") {
    return (
      <div className="container mx-auto flex items-center justify-center gap-3 py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading session...</span>
      </div>
    );
  }

  if (!token || status !== "authenticated") {
    return (
      <div className="container mx-auto py-16">
        <div className="mx-auto max-w-lg rounded-2xl border bg-card p-10 text-center">
          <BookmarkX className="mx-auto h-14 w-14 text-muted-foreground/70" />
          <h2 className="mt-5 text-2xl font-semibold">Not logged in</h2>
          <p className="mt-3 text-muted-foreground">
            Sign in to see and manage your saved properties.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">My Bookmarks</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    const errMsg =
      error?.response?.data?.message || "Could not load bookmarks. Please try again later.";

    return (
      <div className="container mx-auto py-20 text-center">
        <AlertCircle className="mx-auto h-14 w-14 text-red-500" />
        <h2 className="mt-5 text-2xl font-semibold">Something went wrong</h2>
        <p className="mt-3 text-muted-foreground">{errMsg}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookmarks</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {visibleBookmarks.length} saved propert
            {visibleBookmarks.length === 1 ? "y" : "ies"}
            {isFetching ? " • updating..." : ""}
          </p>
        </div>
      </div>

      {visibleBookmarks.length === 0 ? (
        <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-12 text-center">
          <h2 className="text-2xl font-semibold">No bookmarks yet</h2>
          <p className="mt-3 text-muted-foreground">
            Properties you save will appear here. Start exploring!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleBookmarks.map((bookmark) => {
            const property = bookmark.property;
            const firstImage = property.images?.[0] || "/placeholder-property.jpg";

            return (
              <PropertyCard
                key={bookmark._id}
                id={property._id}
                propertyId={property._id}
                image={firstImage}
                title={property.title}
                location={property.location}
                price={formatPriceKES(property.price, property.listingType)}
                beds={property.bedrooms}
                baths={property.bathrooms}
                status={property.listingType}
                tagline={getTagline(property)}
                availability="Available"
                onDelete={handleDelete}
                isDeleting={deletingId === property._id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
