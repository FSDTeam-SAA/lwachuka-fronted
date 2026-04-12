"use client";

import React from "react";
import { Sidebar } from "./_components/Sidebar";
import Header from "./_components/Headers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar (Fixed) */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        {/* Header (Fixed Top) */}
        <Header
          title="Dashboard"
          subtitle="Welcome back 👋"
        />

        {/* ONLY THIS PART SCROLLS */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-[#F8F9FA]">
          {children}
        </main>
      </div>
    </div>
  );
}
