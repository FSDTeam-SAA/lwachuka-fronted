export interface LeadUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber?: string;
    profileImage?: string;
}

export interface LeadProperty {
    _id: string;
    title: string;
    location: string;
    price: number;
    status: string;
}

export interface LeadMessage {
    senderId: string;
    senderRole: string;
    message: string;
}

export type LeadStatus = "pending" | "viewed" | "responded";

export interface Lead {
    _id: string;
    userId: LeadUser;
    propertyId: LeadProperty;
    propertyOwnerId: LeadUser;
    status: LeadStatus;
    isClosed: boolean;
    messages: LeadMessage[];
    createdAt: string;
    updatedAt: string;
}

export interface LeadStats {
    totalInquiry: number;
    pendingInquiry: number;
    viewedInquiry: number;
    respondedInquiry: number;
}

export interface LeadsListResponse {
    statusCode: number;
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: Lead[];
}

export interface SendMessagePayload {
    contactId: string;
    message: string;
}
