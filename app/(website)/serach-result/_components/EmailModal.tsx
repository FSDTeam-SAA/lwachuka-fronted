"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ListingMini = {
  id: number | string;
  price: string;
  location: string;
  title: string;
};

type EmailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: ListingMini | null;
};

export default function EmailModal({ open, onOpenChange, listing }: EmailModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    moveInDate: "",
    phone: "",
  });
  const labelClass = "text-[12px] font-semibold text-[#1F2937]";
  const inputClass =
    "mt-1 h-11 w-full rounded-md border border-[#D1D5DB] bg-white px-3 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#9CA3AF]";
  const dialogTitle = listing?.title
    ? `Email about ${listing.title}`
    : "Email Agent";

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTZiZjRhNDA1Y2MxYThjNDU4YTM1ZiIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3Mjk2ODM4NSwiZXhwIjoxNzczNTczMTg1fQ.bZoc3EWCqSjA1abkwRIAf7Vo-MGltLo_kQxAEiUbS2o"

  const mutation = useMutation({
    mutationFn: async (payload: {
      listingId: string;
      firstName: string;
      lastName: string;
      email: string;
      moveInData: string | null;
      phone: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/calender/${payload.listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            moveInData: payload.moveInData,
            phone: payload.phone,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Failed to send email.");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Email sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        moveInDate: "",
        phone: "",
      });
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to send email. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const listingId = listing?.id ? String(listing.id) : "";
    if (!listingId) {
      toast.error("Listing id is missing.");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const moveInData = formData.moveInDate
      ? new Date(`${formData.moveInDate}T00:00:00.000Z`).toISOString()
      : null;

    mutation.mutate({
      listingId,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      moveInData,
      phone: formData.phone.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[610px] rounded-xl p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-[20px] font-semibold text-[#1E1E1E]">
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  First Name <span className="text-[#E02424]">*</span>
                </label>
                <input
                  required
                  className={inputClass}
                  placeholder="Mariam"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Last Name <span className="text-[#E02424]">*</span>
                </label>
                <input
                  required
                  className={inputClass}
                  placeholder="Beck"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Email Address <span className="text-[#E02424]">*</span>
              </label>
                <input
                  required
                  type="email"
                  className={inputClass}
                  placeholder="mariam.beck@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="relative">
                <label className={labelClass}>Preferred Date</label>
                <input
                  type="date"
                  className={`${inputClass} pr-10`}
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleChange}
                />
                <span className="pointer-events-none absolute right-3 top-[38px] text-[#9AA3AF]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 2V5M17 2V5M3 9H21M5 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="+88 74869 65"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-md bg-[#0B1B33] hover:bg-[#0B1B33]/90"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Sending..." : "Send"}
            </Button>

            <label className="flex items-start gap-2 text-[16px] text-[#7D7D7D]">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0B1B33] focus:ring-[#0B1B33]"
                defaultChecked
              />
              Email me listings and apartment related info.
            </label>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
