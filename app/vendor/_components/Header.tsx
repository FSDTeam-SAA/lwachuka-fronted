"use client";
import React from "react";
interface HeaderProps {
  title?: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
  onLogout?: () => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  title = "Dashboard",
  subtitle,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="w-full px-6 h-[100px] flex items-center justify-between">
        <div className="ml-10 sm:ml-0">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
};

export default Header;
