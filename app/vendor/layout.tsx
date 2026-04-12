"use client";

import React from "react";
import { Sidebar } from "./_components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <main className="min-h-screen bg-[#F8F9FA] lg:ml-[340px]">
        {children}
      </main>
    </div>
  );
}
