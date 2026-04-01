
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
  acres?: number;
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
  createBy?: string | PropertyAgent;
  listingUser?: Array<PropertyAgent | string>;
  bookmarkUser?: Array<string | { _id?: string }>;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PropertyAgent {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  location?: string;
  phoneNumber?: string;
  profileImage?: string;
  expertise?: string;
  serviceArea?: string;
  approvedPropertyCount?: number;
  experience?: string;
  [key: string]: unknown;
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
