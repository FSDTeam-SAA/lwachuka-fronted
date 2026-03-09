"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
    LayoutDashboard,
    Building2,
    PlusCircle,
    TrendingUp,
    Users,
    Briefcase,
    CalendarDays,
    CreditCard,
    Settings,
    LogOut,
    AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/agent/dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/agent/my-properties", label: "My Properties", icon: Building2 },
    { href: "/agent/create-property", label: "Create Property Listing", icon: PlusCircle },
    { href: "/agent/promotions", label: "Promotions", icon: TrendingUp },
    { href: "/agent/leads", label: "Leads", icon: Users },
    { href: "/agent/listing-management", label: "Listing Management", icon: Briefcase },
    { href: "/agent/site-visit-calendar", label: "Site Visit Calendar", icon: CalendarDays },
    { href: "/agent/payment-history", label: "Payment History", icon: CreditCard },
    { href: "/agent/settings", label: "Settings", icon: Settings },
    // NOTE: Add role-based conditional items here
    // e.g. if (role === "agent") → show agent-only items
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({ redirect: false });
        router.push("/");
    };

    return (
        <>
            <aside className="fixed left-0 top-0 h-screen w-full lg:w-[320px] bg-white flex flex-col z-50">
                {/* Logo */}
                <div className="h-[120px] flex items-center justify-center">
                    <Link href="/agent/dashboard">
                        <Image
                            src="/logo.png"
                            alt="HomeFinder"
                            width={120}
                            height={74}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="flex flex-col gap-3">
                        {navItems.map(({ href, label, icon: Icon }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-3 rounded-lg text-[18px] transition-colors",
                                        isActive(href)
                                            ? "bg-[#0D1B2A] text-white font-semibold"
                                            : "text-gray-500 font-normal hover:text-[#0D1B2A] hover:bg-gray-100"
                                    )}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer section — always pinned at bottom */}
                <div className="px-3 py-4 shrink-0 gap-3 flex flex-col">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-[18px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        Log Out
                    </button>

                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-[18px] font-normal text-gray-500 hover:bg-gray-100 hover:text-[#0D1B2A] transition-colors"
                    >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Homepage
                    </Link>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !isLoggingOut && setShowLogoutModal(false)}
                    />

                    {/* Modal Card */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
                            <AlertTriangle className="h-7 w-7 text-red-500" />
                        </div>

                        {/* Text */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900">Log Out?</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Are you sure you want to log out? You will need to sign in again to access your dashboard.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 w-full mt-1">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                disabled={isLoggingOut}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Logging out…
                                    </>
                                ) : (
                                    "Yes, Log Out"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
