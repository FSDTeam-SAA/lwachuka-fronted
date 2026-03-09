"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ProfileInfoUpdate() {
  const [gender, setGender] = useState<"male" | "female">("female")
  const [form, setForm] = useState({
    firstName: "Sarah",
    lastName: "Han",
    email: "sarahhan@gmail.com",
    phone: "+1 (555) 123-4567",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et ante sed sem feugiat tristique at sed mauris. Phasellus urna magna, cursus at mi eu, dapibus porta nisi.",
    streetAddress: "1234 Oak Avenue, San Francisco, CA 94102A",
    location: "Florida, USA",
    postalCode: "30301",
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleDiscard = () => {
    setForm({
      firstName: "Sarah",
      lastName: "Han",
      email: "sarahhan@gmail.com",
      phone: "+1 (555) 123-4567",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et ante sed sem feugiat tristique at sed mauris. Phasellus urna magna, cursus at mi eu, dapibus porta nisi.",
      streetAddress: "1234 Oak Avenue, San Francisco, CA 94102A",
      location: "Florida, USA",
      postalCode: "30301",
    })
    setGender("female")
  }

  return (
    <div className="bg-[#f0f4f9] min-h-screen p-6">
      <div className="flex gap-6 items-start">

        {/* Left Sidebar */}
        <div className="w-60 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Cover */}
          <div className="h-24 bg-gradient-to-br from-slate-400 to-slate-600" />

          {/* Avatar */}
          <div className="flex flex-col items-center -mt-10 px-5 pb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-2xl font-bold text-white">
                  S
                </div>
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-[#1a2341] rounded-full flex items-center justify-center border-2 border-white">
                <Pencil size={10} className="text-white" />
              </button>
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#1a2341]">Sarah Han</h3>
            <p className="text-xs text-gray-400">sarahhan@gmail.com</p>

            {/* Info */}
            <div className="mt-4 w-full space-y-3 text-xs text-gray-600">
              <div>
                <span className="font-semibold text-[#1a2341]">Name: </span>
                Sarah Han
              </div>
              <div>
                <span className="font-semibold text-[#1a2341]">Bio: </span>
                <span className="text-gray-500 leading-relaxed">
                  Dedicated natural health advocate committed to empowering people with safe, holistic, and evidence-based wellness guidance.
                </span>
              </div>
              <div>
                <span className="font-semibold text-[#1a2341]">Email: </span>
                sarahhan@gmail.com
              </div>
              <div>
                <span className="font-semibold text-[#1a2341]">Phone: </span>
                +1 (725) 890-4421
              </div>
              <div>
                <span className="font-semibold text-[#1a2341]">Location: </span>
                87 Meadowbrook Drive, Austin, TX 78703
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-2xl font-bold text-[#1a2341]">Personal Information</h2>
          <p className="text-sm text-gray-400 mt-1 mb-5">Manage your personal information and profile details.</p>

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
              <Label className="text-sm font-medium text-[#1a2341]">First Name</Label>
              <Input
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Sarah"
                className="h-11 rounded-lg border-gray-200 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#1a2341]">Last Name</Label>
              <Input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Han"
                className="h-11 rounded-lg border-gray-200 text-sm"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#1a2341]">Email Address</Label>
              <Input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="sarahhan@gmail.com"
                className="h-11 rounded-lg border-gray-200 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#1a2341]">Phone Number</Label>
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
            <Label className="text-sm font-medium text-[#1a2341]">Street Address</Label>
            <Input
              value={form.streetAddress}
              onChange={(e) => handleChange("streetAddress", e.target.value)}
              className="h-11 rounded-lg border-gray-200 text-sm"
            />
          </div>

          {/* Location + Postal Code */}
          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#1a2341]">Location</Label>
              <Input
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="h-11 rounded-lg border-gray-200 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#1a2341]">Postal Code</Label>
              <Input
                value={form.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                className="h-11 rounded-lg border-gray-200 text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleDiscard}
              className="h-11 px-8 rounded-xl border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm font-medium"
            >
              Discard Changes
            </Button>
            <Button className="h-11 px-8 rounded-xl bg-[#1a2341] hover:bg-[#2a3451] text-white text-sm font-medium">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}