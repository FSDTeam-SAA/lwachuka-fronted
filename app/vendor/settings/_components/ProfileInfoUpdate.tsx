"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfileInfoUpdate() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gender, setGender] = useState<"male" | "female">("female");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    streetAddress: "",
    location: "",
    postalCode: "",
  });

  const session = useSession();
  const userId = session?.data?.user?._id;
  const queryClient = useQueryClient();
  const TOKEN = session?.data?.user?.accessToken;

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ["userData", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  const user = userData?.data;

  // Populate form and sidebar from API response
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        bio: user.bio || "",
        streetAddress: user.address || "",
        location: user.location || "",
        postalCode: user.postCode || "",
      });
      if (user.gender) setGender(user.gender as "male" | "female");
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDiscard = () => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        bio: user.bio || "",
        streetAddress: user.address || "",
        location: user.location || "",
        postalCode: user.postCode || "",
      });
      if (user.gender) setGender(user.gender as "male" | "female");
    }
  };

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" , Authorization: `Bearer ${TOKEN}`,},
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phoneNumber: form.phone,
            bio: form.bio,
            address: form.streetAddress,
            location: form.location,
            postCode: form.postalCode,
            gender,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData", userId] });
    },
  });

  // Image upload mutation
  const imageUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profileImage", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: formData,
        },
      );
      if (!res.ok) throw new Error("Failed to upload image");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData", userId] });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      imageUploadMutation.mutate(file);
    }
  };

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <div className="bg-[#f0f4f9] min-h-screen p-6">
      <div className="flex gap-6 items-stretch">
        {/* Left Sidebar */}
        <div className="w-60 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {/* Cover */}
          <div className="h-24 bg-gradient-to-br from-slate-400 to-slate-600 shrink-0" />

          {/* Avatar */}
          <div className="flex flex-col items-center -mt-10 px-5 pb-6 flex-1">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                {user?.profileImage ? (
                  <Image
                    width={400}
                    height={400}
                    src={user.profileImage}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-2xl font-bold text-white">
                    {user?.firstName?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploadMutation.isPending}
                className="absolute bottom-0 right-0 w-6 h-6 bg-[#1a2341] rounded-full flex items-center justify-center border-2 border-white disabled:opacity-60"
              >
                {imageUploadMutation.isPending ? (
                  <span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Pencil size={10} className="text-white" />
                )}
              </button>
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#1a2341]">
              {fullName || "—"}
            </h3>
            <p className="text-xs text-gray-400">{user?.email || "—"}</p>

            {/* Info */}
            <div className="mt-4 w-full space-y-3 text-xs text-gray-600">
              <div>
                <span className="font-semibold text-[#1a2341]">Role: </span>
                <span className="capitalize">{user?.role || "—"}</span>
              </div>
              <div>
                <span className="font-semibold text-[#1a2341]">Gender: </span>
                <span className="capitalize">{user?.gender || "—"}</span>
              </div>
              <div>
                <span className="font-semibold text-[#1a2341]">Phone: </span>
                {user?.phoneNumber || "—"}
              </div>
              <div>
                <span className="font-semibold text-[#1a2341]">Bio: </span>
                <span className="text-gray-500 leading-relaxed">
                  {user?.bio || "—"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[#1a2341]">Address: </span>
                {user?.address || "—"}
              </div>
              <div>
                <span className="font-semibold text-[#1a2341]">Location: </span>
                {user?.location || "—"}
              </div>
              <div>
                <span className="font-semibold text-[#1a2341]">
                  Post Code:{" "}
                </span>
                {user?.postCode || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col">
          <h2 className="text-2xl font-bold text-[#1a2341]">
            Personal Information
          </h2>
          <p className="text-sm text-gray-400 mt-1 mb-5">
            Manage your personal information and profile details.
          </p>

          <div className="flex-1 flex flex-col">
            {/* Gender */}
            <div className="flex items-center gap-6 mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                  className="accent-[#1a2341]"
                />
                Male
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className="accent-[#1a2341]"
                />
                Female
              </label>
            </div>

            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-[#1a2341]">
                  First Name
                </Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="First name"
                  className="h-11 rounded-lg border-gray-200 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-[#1a2341]">
                  Last Name
                </Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Last name"
                  className="h-11 rounded-lg border-gray-200 text-sm"
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-[#1a2341]">
                  Email Address
                </Label>
                <Input
                readOnly
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                  className="h-11 rounded-lg border-gray-200 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-[#1a2341]">
                  Phone Number
                </Label>
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-11 rounded-lg border-gray-200 text-sm"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1.5 mb-5">
              <Label className="text-sm font-medium text-[#1a2341]">Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="min-h-[90px] rounded-lg border-gray-200 text-sm resize-none"
              />
            </div>

            {/* Street Address */}
            <div className="flex flex-col gap-1.5 mb-5">
              <Label className="text-sm font-medium text-[#1a2341]">
                Street Address
              </Label>
              <Input
                value={form.streetAddress}
                onChange={(e) => handleChange("streetAddress", e.target.value)}
                className="h-11 rounded-lg border-gray-200 text-sm"
              />
            </div>

            {/* Location + Postal Code */}
            <div className="grid grid-cols-2 gap-5 mb-8">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-[#1a2341]">
                  Location
                </Label>
                <Input
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="h-11 rounded-lg border-gray-200 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-[#1a2341]">
                  Postal Code
                </Label>
                <Input
                  value={form.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  className="h-11 rounded-lg border-gray-200 text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-auto">
              <Button
                variant="outline"
                onClick={handleDiscard}
                disabled={updateUserMutation.isPending}
                className="h-11 px-8 rounded-[8px] border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm font-medium"
              >
                Discard Changes
              </Button>
              <Button
                onClick={() => updateUserMutation.mutate()}
                disabled={updateUserMutation.isPending}
                className="h-11 px-8 rounded-[8px] bg-[#1a2341] hover:bg-[#2a3451] text-white text-sm font-medium"
              >
                {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
