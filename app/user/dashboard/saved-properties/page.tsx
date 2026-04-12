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

  const { data } = await axios.get<ApiResponse>(
    `${baseUrl}/bookmark?sortOrder=desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

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

function formatPriceKES(
  price: number,
  listingType: "For Sale" | "For Rent"
): string {
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
    <div className="w-full overflow-hidden rounded-2xl bg-[#EAEAEA] p-3 sm:rounded-[24px] sm:p-4 lg:rounded-[28px] lg:p-6">
      <div className="h-[180px] w-full animate-pulse rounded-xl bg-gray-300 sm:h-[220px] sm:rounded-[20px] lg:h-[250px] lg:rounded-[24px]" />

      <div className="space-y-3 px-1 pt-4 sm:px-2 sm:pt-5">
        <div className="h-5 w-4/5 animate-pulse rounded bg-gray-300 sm:h-6" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-gray-300" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-gray-300 sm:h-7" />

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-gray-300 sm:h-9" />
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

  const { data, isLoading, isError, error, isFetching } = useQuery<
    ApiResponse,
    AxiosError<ApiErrorResponse>
  >({
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

        const filtered = old.data.filter(
          (item) => item.property?._id !== propertyId
        );

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

  if (status === "loading") {
    return (
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center gap-3 px-4 py-16 text-sm text-muted-foreground sm:px-6 sm:py-20 sm:text-base lg:px-8">
        <Loader2 className="h-5 w-5 animate-spin sm:h-6 sm:w-6" />
        <span>Loading session...</span>
      </div>
    );
  }

  if (!token || status !== "authenticated") {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-lg rounded-xl border bg-card p-6 text-center sm:rounded-2xl sm:p-10">
          <BookmarkX className="mx-auto h-12 w-12 text-muted-foreground/70 sm:h-14 sm:w-14" />
          <h2 className="mt-4 text-xl font-semibold sm:mt-5 sm:text-2xl">
            Not logged in
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
            Sign in to see and manage your saved properties.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <h1 className="mb-6 text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl lg:text-3xl">
          My Bookmarks
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    const errMsg =
      error?.response?.data?.message ||
      "Could not load bookmarks. Please try again later.";

    return (
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 sm:h-14 sm:w-14" />
        <h2 className="mt-4 text-xl font-semibold sm:mt-5 sm:text-2xl">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
          {errMsg}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            My Bookmarks
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:mt-1.5 sm:text-sm">
            {visibleBookmarks.length} saved propert
            {visibleBookmarks.length === 1 ? "y" : "ies"}
            {isFetching ? " • updating..." : ""}
          </p>
        </div>
      </div>

      {visibleBookmarks.length === 0 ? (
        <div className="mx-auto max-w-md rounded-xl border bg-card p-6 text-center sm:max-w-2xl sm:rounded-2xl sm:p-12">
          <h2 className="text-lg font-semibold sm:text-2xl">
            No bookmarks yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
            Properties you save will appear here. Start exploring!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleBookmarks.map((bookmark) => {
            const property = bookmark.property;
            const firstImage =
              property.images?.[0] || "/placeholder-property.jpg";

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