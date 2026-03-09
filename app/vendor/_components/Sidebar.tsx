"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Megaphone, CreditCard, Settings } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { LogoutModal } from "./LogoutModal";

const navigation = [
  //   { name: "Dashboard Overview", href: "/", icon: LayoutDashboard },
  // {
  //   name: "User Management",
  //   href: "/user-management", 
  //   icon: UsersRound ,
  // },
  // { name: "Agent Management", href: "/agent-management", icon: UserCheck },
  // { name: "Vendor Management", href: "/vendor-management", icon: Store  },
  // { name: "Property Listings", href: "/property-listings", icon: Building2 },
  { name: "Advertisements", href: "/vendor/advertisements", icon: Megaphone },
  // { name: "Paid Listing", href: "/paid-listings", icon: Banknote },
  // { name: "Subscription Management", href: "/subscription-management", icon: BellDot },
  { name: "Billing & Payments", href: "/vendor/billing-payments", icon: CreditCard },
  // { name: "Analytics & Reports", href: "/analytics-reports", icon: ChartColumn },
  // { name: "Security & Audit Logs", href: "/security-audit", icon: Shield },
  { name: "Settings", href: "/vendor/settings", icon: Settings },

];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Open Button */}
      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden fixed top-7 left-3 z-50 p-2.5 rounded-lg bg-[#212121] text-white shadow-lg hover:bg-[#313131] transition"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static top-0 left-0 z-50",
          "h-screen flex flex-col bg-white transition-transform duration-300 shadow-[0px_4px_6px_0px_#0000001A]",
          "w-[280px] lg:w-[340px] ",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo + Close */}
        <div className="h-[80px] flex items-center justify-center relative px-4">
          <div>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden absolute right-4 p-2 text-white"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-3 overflow-y-auto mt-4">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 !rounded-[8px] px-4 py-3.5 text-sm transition-all",
                  isActive
                    ? "bg-[#061F3D] text-white font-semibold shadow-[0px_4px_6px_0px_#F57E281A]"
                    : "text-[#7D7D7D]",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0 text-[18px]" />
                <span className="text-[18px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <LogoutModal />
        </div>
      </aside>
    </>
  );
}
