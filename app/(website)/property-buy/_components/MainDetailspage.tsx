"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PropertyImageGallery } from "../_components/PropertyImageGallery";
import { PropertyDetailsWithAgentCard } from "../_components/PropertyDetailsWithAgentCard";
import { PropertyExtrasSection } from "../_components/PropertyExtrasSection";
import SimilarProperties from "./SimilarProperies";
import { Property, PropertySingleApiResponse } from "@/types/PropertyType";

const fetchProperty = async (id: string): Promise<Property> => {
  const { data } = await axios.get<PropertySingleApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/property/${id}`
  );
  if (!data.success) throw new Error(data.message || "Failed to load property");
  return data.data;
};

export default function MainDetailsPage({ id }: { id: string }) {
  const { data: property, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchProperty(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-600">
        <p>Invalid property id.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-600">
        <p>Failed to load property. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className=" pb-12">
      <PropertyImageGallery images={property.images ?? []} title={property.title} />

      <PropertyDetailsWithAgentCard property={property} />
      <PropertyExtrasSection property={property} />

      <SimilarProperties currentPropertyId={property._id} />
    </div>
  );
}
