import api from "@/lib/api";
import {
    Property,
    PropertyFormData,
    ApiResponse,
    PropertiesListResponse
} from "@/types/properties";

export const propertyKeys = {
    all: ["properties"] as const,
    myList: () => [...propertyKeys.all, "my-list"] as const,
    detail: (id: string) => [...propertyKeys.all, id] as const,
};

// GET /property/my-property
export const getMyProperties = async (): Promise<PropertiesListResponse> => {
    const response = await api.get("/property/my-property");
    return response.data;
};

// GET /property/:id
export const getPropertyById = async (id: string): Promise<ApiResponse<Property>> => {
    const response = await api.get(`/property/${id}`);
    return response.data;
};

// POST /property — multipart/form-data
export const createProperty = async (formData: FormData): Promise<ApiResponse<Property>> => {
    const response = await api.post("/property", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// PUT /property/:id — multipart/form-data
export const updateProperty = async (id: string, formData: FormData): Promise<ApiResponse<Property>> => {
    const response = await api.put(`/property/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// DELETE /property/:id
export const deleteProperty = async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/property/${id}`);
    return response.data;
};

// FormData builder helper
export const buildPropertyFormData = (data: PropertyFormData): FormData => {
    const fd = new FormData();
    // Append all non-undefined string/number fields
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === "images") return; // handle separately
        if (key === "propertyCommunityAmenities" && Array.isArray(value)) {
            fd.append(key, JSON.stringify(value));
            return;
        }
        fd.append(key, String(value));
    });
    // Append image files
    data.images?.forEach((file) => fd.append("images", file));
    return fd;
};
