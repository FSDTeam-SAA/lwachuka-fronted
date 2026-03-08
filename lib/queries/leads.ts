import api from "@/lib/api";
import {
    LeadsListResponse,
    LeadStats,
    Lead,
    SendMessagePayload
} from "@/types/leads";
import { ApiResponse } from "@/types/user";

export const leadKeys = {
    all: ["leads"] as const,
    list: () => [...leadKeys.all, "list"] as const,
    stats: () => [...leadKeys.all, "stats"] as const,
    detail: (id: string) => [...leadKeys.all, id] as const,
};

// GET /contact-property/my-leads
export const getLeads = async (token?: string): Promise<LeadsListResponse> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await api.get("/contact-property/my-leads", { headers });
    return res.data;
};

// GET /contact-property/inquiry-history
export const getLeadStats = async (token?: string): Promise<ApiResponse<LeadStats>> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await api.get("/contact-property/inquiry-history", { headers });
    return res.data;
};

// GET /contact-property/lead/:id
export const getLeadById = async (id: string, token?: string): Promise<ApiResponse<Lead>> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await api.get(`/contact-property/lead/${id}`, { headers });
    return res.data;
};

// POST /contact-property/send-message
// Body: { contactId, message }
export const sendMessage = async (
    payload: SendMessagePayload,
    token?: string
): Promise<ApiResponse<Lead>> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await api.post("/contact-property/send-message", payload, { headers });
    return res.data;
};
