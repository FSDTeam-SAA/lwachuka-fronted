export type ListingType = "For Sale" | "For Rent";
export type PropertyStatus = "pending" | "approved" | "rejected";
export type PropertyType =
    | "Apartment"
    | "Studio"
    | "Penthouse"
    | "Duplex"
    | "Condo"
    | "Bungalow"
    | "Land";

export interface Property {
    _id: string;
    title: string;
    listingType: ListingType;
    propertyType: PropertyType;
    location: string;
    price: number;
    status: PropertyStatus;
    createdAt: string;
    updatedAt: string;
    // Optional fields (match backend model)
    bedrooms?: number;
    bathrooms?: number;
    acres?: number;
    area?: number;
    landArea?: number;
    builtUp?: number;
    plot?: number;
    description?: string;
    lat?: number;
    lng?: number;
    images?: string[];
    createBy?: string;
    listingUser?: string[];
    bookmarkUser?: string[];
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
    parking?: boolean;
    gatedCommunity?: boolean;
    staffQuarters?: boolean;
}

export interface PropertyFormData {
    title?: string;
    listingType?: ListingType;
    propertyType?: PropertyType;
    bedrooms?: number;
    bathrooms?: number;
    acres?: number;
    area?: number;
    landArea?: number;
    builtUp?: number;
    plot?: number;
    description?: string;
    location?: string;
    lat?: number;
    lng?: number;
    price?: number;
    // Optional fields
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
    parking?: boolean;
    gatedCommunity?: boolean;
    staffQuarters?: boolean;
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
