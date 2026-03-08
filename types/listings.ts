export type PropertyStatus = "approved" | "pending" | "rejected";
export type ListingType = "For Sale" | "For Rent";

export interface Property {
    _id: string;
    title: string;
    listingType: ListingType;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    description: string;
    location: string;
    lat: number;
    lng: number;
    price: number;
    images: string[];
    status: PropertyStatus;
    createBy: string;
    bookmarkUser: string[];
    listingUser: string[];
    propertyCommunityAmenities: string[];
    createdAt: string;
    updatedAt: string;
}

export interface PropertiesListResponse {
    statusCode: number;
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: Property[];
}
