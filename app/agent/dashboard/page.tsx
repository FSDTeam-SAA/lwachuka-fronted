import {
    Building2,
    Eye,
    CalendarDays,
    TrendingUp,
    MessageSquare,
    UserCheck,
    List,
    PlusCircle,
    Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const statCards = [
    {
        title: "Total Property Listings",
        value: "24",
        subtitle: "All properties in your portfolio",
        icon: Building2,
    },
    {
        title: "Active Listings",
        value: "18",
        subtitle: "Currently visible to buyers",
        icon: Eye,
    },
    {
        title: "Upcoming Site Visits",
        value: "12",
        subtitle: "Scheduled for this week",
        icon: CalendarDays,
    },
];

const performanceCards = [
    { title: "Total Views", value: "3,452", icon: Eye },
    { title: "Inquiries", value: "287", icon: MessageSquare },
    { title: "Site Visit Requests", value: "45", icon: UserCheck },
];

const quickActions = [
    { label: "View Listings", icon: List, href: "/agent/properties" },
    { label: "Create New Listing", icon: PlusCircle, href: "/agent/create-listing" },
    { label: "View Site Visit Calendar", icon: Calendar, href: "/agent/calendar" },
];

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default async function AgentDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    return (
        <div className="min-h-screen">
            <DashboardHeader
                title="Dashboard Overview"
                subtitle="Welcome back! Here's your property portfolio summary."
            />

            <div className="p-8">

                {/* Row 1 — Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {statCards.map((card) => (
                        <Card key={card.title} className="bg-white border border-gray-200 rounded-xl shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">{card.title}</p>
                                        <p className="text-4xl font-bold text-[#0D1B2A] mt-2 mb-3">{card.value}</p>
                                        <p className="text-xs text-gray-400">{card.subtitle}</p>
                                    </div>
                                    <div className="bg-[#F4F6F8] p-2.5 rounded-lg">
                                        <card.icon className="h-5 w-5 text-[#0D1B2A]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Listing Performance Overview */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-[#0D1B2A]" />
                        <h2 className="text-base font-semibold text-[#0D1B2A]">
                            Listing Performance Overview
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        Your performance metrics for the last 30 days
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {performanceCards.map((card) => (
                            <Card key={card.title} className="bg-white border border-gray-200 rounded-xl shadow-sm">
                                <CardContent className="p-6">
                                    <p className="text-xs text-gray-500 font-medium">{card.title}</p>
                                    <p className="text-3xl font-bold text-[#0D1B2A] mt-2">{card.value}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-base font-semibold text-[#0D1B2A] mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {quickActions.map((action) => (
                            <Link key={action.label} href={action.href}>
                                <Button
                                    variant="outline"
                                    className="w-full h-[72px] flex flex-col gap-1.5 items-center justify-center border border-gray-200 rounded-xl text-[#0D1B2A] hover:bg-[#F4F6F8] text-sm font-medium"
                                >
                                    <action.icon className="h-5 w-5 text-[#0D1B2A]" />
                                    {action.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
