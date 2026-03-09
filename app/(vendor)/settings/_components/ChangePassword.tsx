"use client"

import { useState } from "react"
import { Eye, EyeOff, Pencil, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

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
        className={`h-11 rounded-lg pr-10 text-sm ${
          hasError ? "border-red-400 focus-visible:ring-red-300" : "border-gray-200"
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

  const handleDiscard = () => {
    setCurrent("")
    setNewPass("")
    setConfirm("")
  }

  return (
    <div className="bg-[#f0f4f9] min-h-screen p-6">
      <div className="flex gap-6 items-start">

        {/* Left Sidebar */}
        <div className="w-60 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-slate-400 to-slate-600" />
          <div className="flex flex-col items-center -mt-10 px-5 pb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-2xl font-bold text-white">
                S
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-[#1a2341] rounded-full flex items-center justify-center border-2 border-white">
                <Pencil size={10} className="text-white" />
              </button>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-[#1a2341]">Sarah Han</h3>
            <p className="text-xs text-gray-400">sarahhan@gmail.com</p>
            <div className="mt-4 w-full space-y-3 text-xs text-gray-600">
              <div><span className="font-semibold text-[#1a2341]">Name: </span>Sarah Han</div>
              <div>
                <span className="font-semibold text-[#1a2341]">Bio: </span>
                <span className="text-gray-500 leading-relaxed">
                  Dedicated natural health advocate committed to empowering people with safe, holistic, and evidence-based wellness guidance.
                </span>
              </div>
              <div><span className="font-semibold text-[#1a2341]">Email: </span>sarahhan@gmail.com</div>
              <div><span className="font-semibold text-[#1a2341]">Phone: </span>+1 (725) 890-4421</div>
              <div><span className="font-semibold text-[#1a2341]">Location: </span>87 Meadowbrook Drive, Austin, TX 78703</div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
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
              <Label className="text-sm font-medium text-[#1a2341]">New  Password</Label>
              <PasswordInput value={newPass} onChange={setNewPass} />
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5 mb-6">
            <Label className="text-sm font-medium text-[#1a2341]">Confirm New  Password</Label>
            <PasswordInput value={confirm} onChange={setConfirm} hasError={confirmError} />
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