"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser, userKeys } from "@/lib/queries/user";
import { UpdateProfilePayload } from "@/types/user";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Camera, User as UserIcon } from "lucide-react";
import Image from "next/image";

interface ProfileFormProps {
    userId: string;
}

export function ProfileForm({ userId }: ProfileFormProps) {
    const queryClient = useQueryClient();
    const fileRef = useRef<HTMLInputElement>(null);
    const { data: session } = useSession();
    const token = session?.user?.accessToken;

    const { data } = useQuery({
        queryKey: userKeys.detail(userId),
        queryFn: () => getUser(userId, token),
        enabled: !!userId && !!token,
    });

    const user = data?.data;

    const [form, setForm] = useState<UpdateProfilePayload>({});
    const [imageFile, setImageFile] = useState<File | undefined>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Derived values: use form state if touched, otherwise fall back to API data
    const val = (field: keyof UpdateProfilePayload) =>
        (form[field] as string | undefined) ?? (user?.[field as keyof typeof user] as string | undefined) ?? "";

    const mutation = useMutation({
        mutationFn: (payload: UpdateProfilePayload) => updateUser(userId, payload, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
            toast.success("Profile updated successfully!");
        },
        onError: () => {
            toast.error("Failed to update profile");
        },
    });

    const handleChange = (field: keyof UpdateProfilePayload, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: UpdateProfilePayload = { ...form };
        if (imageFile) payload.profileImage = imageFile;
        mutation.mutate(payload);
    };

    const handleDiscard = () => {
        setForm({});
        setImageFile(undefined);
        setImagePreview(null);
    };

    const currentImage = imagePreview || user?.profileImage;

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-[#0D1B2A]">Personal Information</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your personal information and profile details.
                </p>
            </div>

            {/* Profile Image Upload */}
            <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                        {currentImage ? (
                            <Image
                                src={currentImage}
                                alt="Profile Preview"
                                width={96}
                                height={96}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <UserIcon className="h-10 w-10 text-gray-400" />
                        )}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-6 w-6 text-white mb-1" />
                        <span className="text-[10px] text-white font-medium">Change</span>
                    </div>
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h3 className="text-sm font-semibold text-gray-900">Profile Photo</h3>
                    <p className="text-xs text-gray-500 max-w-sm">
                        Recommended 300x300 pixels. Use PNG, JPG or WEBP formats. Maximum file size 5MB.
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileRef.current?.click()}
                        className="mt-2"
                    >
                        Upload New Photo
                    </Button>
                </div>
                {/* Hidden file input */}
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Gender */}
            <div className="mb-5">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Gender</Label>
                <RadioGroup
                    value={val("gender")}
                    onValueChange={(v) => handleChange("gender", v)}
                    className="flex gap-6 flex-row"
                >
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="text-sm font-medium cursor-pointer">
                            Male
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="text-sm font-medium cursor-pointer">
                            Female
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-1.5 block">
                        First Name
                    </Label>
                    <Input
                        id="firstName"
                        value={val("firstName")}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        placeholder="Sarah"
                    />
                </div>
                <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Last Name
                    </Label>
                    <Input
                        id="lastName"
                        value={val("lastName")}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        placeholder="Han"
                    />
                </div>
            </div>

            {/* Email + Password */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={val("email")}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="sarah@example.com"
                    />
                </div>
                <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Password (Optional)
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={val("password")}
                        onChange={(e) => handleChange("password", e.target.value)}
                        placeholder="Enter to change password"
                    />
                </div>
            </div>

            {/* Phone + Role */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Phone Number
                    </Label>
                    <Input
                        id="phone"
                        value={val("phoneNumber")}
                        onChange={(e) => handleChange("phoneNumber", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                    />
                </div>
                <div>
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Role
                    </Label>
                    <Input
                        id="role"
                        value={val("role")}
                        onChange={(e) => handleChange("role", e.target.value)}
                        placeholder="user, agent..."
                    />
                </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Bio
                </Label>
                <Textarea
                    id="bio"
                    rows={4}
                    value={val("bio")}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                />
            </div>

            {/* Street Address */}
            <div className="mb-4">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Street Address
                </Label>
                <Input
                    id="address"
                    value={val("address")}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="1234 Oak Avenue"
                />
            </div>

            {/* Location + Postal Code */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Location
                    </Label>
                    <Input
                        id="location"
                        value={val("location")}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="Florida, USA"
                    />
                </div>
                <div>
                    <Label htmlFor="postCode" className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Postal Code
                    </Label>
                    <Input
                        id="postCode"
                        value={val("postCode")}
                        onChange={(e) => handleChange("postCode", e.target.value)}
                        placeholder="30301"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleDiscard}>
                    Discard Changes
                </Button>
                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-[#0D1B2A] text-white hover:bg-[#1A3A5C]"
                >
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
