"use client";

import PropertyCard from "./_components/PropertyCard";

const properties = [
  {
    id: 1,
    image: "/cardimage.jpg",
    title: "Modern 3-Bedroom Apartment in Westland's",
    location: "Nairobi, Karen",
    price: "KES 85.0M",
    beds: 3,
    baths: 2,
  },
  {
    id: 2,
    image: "/cardimage.jpg",
    title: "Modern 3-Bedroom Apartment in Westland's",
    location: "Nairobi, Karen",
    price: "KES 100,000/mo",
    beds: 3,
    baths: 2,
    status: "For Rent" as const,
  },
  {
    id: 3,
    image: "/cardimage.jpg",
    title: "Modern 3-Bedroom Apartment in Westland's",
    location: "Nairobi, Karen",
    price: "KES 125.0M",
    beds: 3,
    baths: 2,
  },
];

export default function PropertyPage() {
  const handleDelete = (id: number) => {
    console.log("Delete property:", id);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            {...property}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}