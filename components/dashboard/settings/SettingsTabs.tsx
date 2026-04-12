"use client";

import { useState } from "react";
import { User, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { cn } from "@/lib/utils";
import { ChangePasswordForm } from "@/components/dashboard/settings/ChangePasswordForm";
import { ProfileCard } from "@/components/dashboard/settings/ProfileCard";
import { ProfileForm } from "@/components/dashboard/settings/ProfileForm";

type Tab = "profile" | "password";

interface SettingsTabsProps {
  defaultTab?: Tab;
  wrapperClassName?: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function SettingsTabs({
  defaultTab = "profile",
  wrapperClassName = "min-h-screen",
  headerTitle = "Settings",
  headerSubtitle = "Manage your profile and platform preferences",
}: SettingsTabsProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const userId = session?.user?._id ?? "";

  return (
    <div className={wrapperClassName}>
      <DashboardHeader title={headerTitle} subtitle={headerSubtitle} />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left — Profile Card */}
          <div className="w-full lg:w-[280px] shrink-0">
            <ProfileCard userId={userId} />
          </div>

          {/* Right — Tab Content */}
          <div className="w-full flex-1 min-w-0">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
              <div className="grid grid-cols-2 lg:grid-cols-1 divide-x lg:divide-x-0 lg:divide-y divide-gray-100">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={cn(
                    "flex items-center justify-center lg:justify-start gap-2 lg:gap-3 w-full px-4 lg:px-5 py-3 lg:py-4 text-sm font-medium transition-colors border-b-2 lg:border-b-0 lg:border-l-4",
                    activeTab === "profile"
                      ? "border-b-[#0D1B2A] lg:border-l-[#0D1B2A] text-[#0D1B2A] bg-gray-50"
                      : "border-b-transparent lg:border-l-transparent text-gray-500 hover:bg-gray-50",
                  )}
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={cn(
                    "flex items-center justify-center lg:justify-start gap-2 lg:gap-3 w-full px-4 lg:px-5 py-3 lg:py-4 text-sm font-medium transition-colors border-b-2 lg:border-b-0 lg:border-l-4",
                    activeTab === "password"
                      ? "border-b-[#0D1B2A] lg:border-l-[#0D1B2A] text-[#0D1B2A] bg-gray-50"
                      : "border-b-transparent lg:border-l-transparent text-gray-500 hover:bg-gray-50",
                  )}
                >
                  <Lock className="h-4 w-4" />
                  Password
                </button>
              </div>
            </div>

            {/* Form Area */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 lg:p-6">
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
