export type ListingType = "For Sale" | "For Rent";
export type PropertyStatus = "pending" | "approved" | "rejected";

export interface Property {
    _id: string;
    title: string;
    listingType: ListingType;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    description?: string;
    location: string;
    lat?: number;
    lng?: number;
    price: number;
    images: string[];
    status: PropertyStatus;
    createBy: string;
    // Optional fields
    builtUp?: number;
    plot?: number;
    keyBedRooms?: string;
    keyBathrooms?: string;
    keyBuiltUp?: number;
    keyKitchenType?: string;
    keyParking?: string;
    keyFinishes?: string;
    keyBalconyType?: string;
    keyStorage?: string;
    keyCoolingSystem?: string;
    keyMoveInStatus?: string;
    propertyCommunityAmenities?: string[];
    originalPrice?: number;
    purpose?: string;
    referenceNumber?: string;
    furnishing?: string;
    addedOn?: string;
    handoverDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PropertyFormData {
    title: string;
    listingType: ListingType;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    description?: string;
    location: string;
    price: number;
    // Optional fields
    builtUp?: number;
    plot?: number;
    keyBedRooms?: string;
    keyBathrooms?: string;
    keyBuiltUp?: number;
    keyKitchenType?: string;
    keyParking?: string;
    keyFinishes?: string;
    keyBalconyType?: string;
    keyStorage?: string;
    keyCoolingSystem?: string;
    keyMoveInStatus?: string;
    propertyCommunityAmenities?: string[];
    originalPrice?: number;
    purpose?: string;
    referenceNumber?: string;
    furnishing?: string;
    addedOn?: string;
    handoverDate?: string;
    images?: File[];
}

export interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
}

export interface PropertiesListResponse extends ApiResponse<Property[]> {
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}
