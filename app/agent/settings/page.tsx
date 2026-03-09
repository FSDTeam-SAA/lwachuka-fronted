"use client";

import { useState } from "react";
import { User, Lock } from "lucide-react";
import { ProfileCard } from "@/components/dashboard/settings/ProfileCard";
import { ProfileForm } from "@/components/dashboard/settings/ProfileForm";
import { ChangePasswordForm } from "@/components/dashboard/settings/ChangePasswordForm";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

type Tab = "profile" | "password";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const userId = session?.user?._id ?? "";

    return (
        <div className="min-h-screen">
            <DashboardHeader
                title="Settings"
                subtitle="Manage your profile and platform preferences"
            />

            <div className="p-8">

                <div className="flex gap-6 items-start">
                    {/* Left — Profile Card */}
                    <div className="w-[280px] shrink-0">
                        <ProfileCard userId={userId} />
                    </div>

                    {/* Right — Tab Content */}
                    <div className="flex-1 min-w-0">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={cn(
                                    "flex items-center gap-3 w-full px-5 py-4 text-sm font-medium transition-colors border-l-4",
                                    activeTab === "profile"
                                        ? "border-l-[#0D1B2A] text-[#0D1B2A] bg-gray-50"
                                        : "border-l-transparent text-gray-500 hover:bg-gray-50"
                                )}
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </button>
                            <div className="h-px bg-gray-100 mx-4" />
                            <button
                                onClick={() => setActiveTab("password")}
                                className={cn(
                                    "flex items-center gap-3 w-full px-5 py-4 text-sm font-medium transition-colors border-l-4",
                                    activeTab === "password"
                                        ? "border-l-[#0D1B2A] text-[#0D1B2A] bg-gray-50"
                                        : "border-l-transparent text-gray-500 hover:bg-gray-50"
                                )}
                            >
                                <Lock className="h-4 w-4" />
                                Password
                            </button>
                        </div>

                        {/* Form Area */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            {activeTab === "profile" ? (
                                <ProfileForm userId={userId} />
                            ) : (
                                <ChangePasswordForm />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
