"use client"

import { useRef, useState } from "react"
import { Eye, EyeOff, Pencil, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import Image from "next/image"

function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  hasError = false,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hasError?: boolean
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-11 rounded-lg pr-10 text-sm ${hasError ? "border-red-400 focus-visible:ring-red-300" : "border-gray-200"
          }`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

export default function ChangePassword() {
  const [current, setCurrent] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirm, setConfirm] = useState("")

  const session = useSession()
  const userId = session?.data?.user?._id
  const TOKEN = session?.data?.user?.accessToken
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ["userData", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`
      )
      if (!res.ok) throw new Error("Failed to fetch user")
      return res.json()
    },
  })

  const user = userData?.data
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim()

  // Image upload mutation
  const imageUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("profileImage", file)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${TOKEN}` },
          body: formData,
        }
      )
      if (!res.ok) throw new Error("Failed to upload image")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData", userId] })
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) imageUploadMutation.mutate(file)
  }

  // Password rules
  const rules = [
    {
      label: "Minimum 8-12 characters (recommend 12+ for stronger security).",
      valid: newPass.length >= 8,
    },
    {
      label: "At least one uppercase letter must.",
      valid: /[A-Z]/.test(newPass),
    },
    {
      label: "At least one lowercase letter must.",
      valid: /[a-z]/.test(newPass),
    },
    {
      label: "At least one number must (0-9).",
      valid: /[0-9]/.test(newPass),
    },
    {
      label: "At least special character (! @ # $ % ^ & * etc.)",
      valid: /[!@#$%^&*]/.test(newPass),
    },
    {
      label: "No spaces allowed.",
      valid: newPass.length > 0 && !/\s/.test(newPass),
    },
  ]

  const confirmError = confirm.length > 0 && confirm !== newPass
  const allRulesValid = rules.every((r) => r.valid)
  const canSubmit = current.length > 0 && allRulesValid && !confirmError && confirm === newPass

  const handleDiscard = () => {
    setCurrent("")
    setNewPass("")
    setConfirm("")
  }

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            oldPassword: current,
            newPassword: newPass,
          }),
        }
      )
      if (!res.ok) throw new Error("Failed to change password")
      return res.json()
    },
    onSuccess: () => {
      handleDiscard()
    },
  })

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
                <span className="font-semibold text-[#1a2341]">Post Code: </span>
                {user?.postCode || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col">
          <h2 className="text-2xl font-bold text-[#1a2341]">Changes Password</h2>
          <p className="text-sm text-gray-400 mt-1 mb-7">
            Manage your account preferences, security settings, and privacy options.
          </p>

          {/* Current + New Password */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#1a2341]">Current Password</Label>
              <PasswordInput value={current} onChange={setCurrent} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#1a2341]">New Password</Label>
              <PasswordInput value={newPass} onChange={setNewPass} />
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5 mb-6">
            <Label className="text-sm font-medium text-[#1a2341]">Confirm New Password</Label>
            <PasswordInput value={confirm} onChange={setConfirm} hasError={confirmError} />
            {confirmError && (
              <span className="text-xs text-red-500 mt-1">Passwords do not match.</span>
            )}
          </div>

          {/* Validation Rules */}
          <ul className="space-y-2 mb-8">
            {rules.map((rule, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {rule.valid ? (
                  <Check size={14} className="text-green-500 shrink-0" />
                ) : (
                  <X size={14} className="text-red-500 shrink-0" />
                )}
                <span className={`text-xs ${rule.valid ? "text-gray-600" : "text-red-500"}`}>
                  {rule.label}
                </span>
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-auto">
            <Button
              variant="outline"
              onClick={handleDiscard}
              disabled={changePasswordMutation.isPending}
              className="h-11 px-8 rounded-[8px] border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm font-medium"
            >
              Discard Changes
            </Button>
            <Button
              onClick={() => changePasswordMutation.mutate()}
              disabled={!canSubmit || changePasswordMutation.isPending}
              className="h-11 px-8 rounded-[8px] bg-[#1a2341] hover:bg-[#2a3451] text-white text-sm font-medium disabled:opacity-50"
            >
              {changePasswordMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}