"use client"

import { User, KeyRound, ChevronRight } from "lucide-react"
import Link from "next/link"
import Header from "../../_components/Header"

const settingsItems = [
  {
    icon: <User size={15} strokeWidth={1.5} className="text-[#1a2341]" />,
    label: "Profile",
    href: "/settings/profileinfo",
  },
  {
    icon: <KeyRound size={15} strokeWidth={1.5} className="text-[#1a2341]" />,
    label: "Password",
    href: "/settings/change-password",
  },
]

export default function SettingsPage() {
  return (
    <div>
      <Header
          title="Settings"
          subtitle="Manage your admin preferences and platform configuration"
        />
      <div className="space-y-4 p-6"> {/* gap between two cards */}
      {settingsItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="bg-white shadow-sm rounded-lg px-6 py-4 
                     flex items-center justify-between 
                     hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span className="text-sm font-medium text-[#1a2341]">
              {item.label}
            </span>
          </div>
          <ChevronRight size={15} className="text-gray-400" />
        </Link>
      ))}
    </div>
    </div>
  )
}