
// types/property.ts  (recommended to put in a separate file)
export interface Property {
  _id: string;
  title: string;
  listingType: "For Sale" | "For Rent";
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;           // in sqm probably
  description: string;
  plot: number;
  location: string;
  price: number;
  images: string[];
  status: "approved" | "rejected" | "pending"; // adjust as needed
  // Optional detailed fields from single property endpoint
  builtUp?: number;
  keyBathrooms?: string;
  keyBedRooms?: string;
  keyBuiltUp?: number | string;
  keyKitchenType?: string;
  keyParking?: string;
  keyFinishes?: string;
  keyBalconyType?: string;
  keyStorage?: string;
  keyCoolingSystem?: string;
  keyMoveInStatus?: string;
  propertyCommunityAmenities?: string[];
  purpose?: string;
  referenceNumber?: string;
  furnishing?: string;
  addedOn?: string;
  originalPrice?: number;
  handoverDate?: string;
  lat?: number;
  lng?: number;
  createBy?: string;
  listingUser?: Array<Record<string, unknown>>;
  bookmarkUser?: Array<Record<string, unknown>>;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PropertyApiResponse {
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

export interface PropertySingleApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Property;
  responseTime?: string;
}
