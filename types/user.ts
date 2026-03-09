export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
    role: "user" | "agent";
    gender: "male" | "female";
    phoneNumber: string;
    bio: string;
    address: string;
    location: string;
    postCode: string;
    lat?: number;
    lng?: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    responseTime: string;
}

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string;
    gender?: "male" | "female";
    phoneNumber?: string;
    bio?: string;
    address?: string;
    location?: string;
    postCode?: string;
    profileImage?: File | Blob;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}
