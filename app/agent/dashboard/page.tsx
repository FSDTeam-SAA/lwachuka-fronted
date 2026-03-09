'use client'

import { useState } from 'react'
import {
  Building2,
  Eye,
  CalendarDays,
  List,
  PlusCircle,
  Calendar as CalendarIcon,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { dashboardKeys, getAgentOverview } from '@/lib/queries/dashboard'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function AgentDashboard() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const { data, isLoading } = useQuery({
    queryKey: dashboardKeys.overview(selectedYear),
    queryFn: () => getAgentOverview(selectedYear, token),
    enabled: !!token,
  })

  const overview = data?.data

  const stats = [
    {
      title: 'Total Property Listings',
      value: overview?.totalProperty || 0,
      subtitle: 'All properties in your portfolio',
      icon: Building2,
    },
    {
      title: 'Active Listings',
      value: overview?.activeProperty || 0,
      subtitle: 'Currently visible to buyers',
      icon: Eye,
    },
    {
      title: 'Upcoming Site Visits',
      value: overview?.upCommingSiteViste || 0,
      subtitle: 'Scheduled for this week',
      icon: CalendarDays,
    },
  ]

  const quickActions = [
    {
      label: 'View Listings',
      icon: List,
      href: '/agent/my-properties',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Create New Listing',
      icon: PlusCircle,
      href: '/agent/create-property',
      bgColor: 'bg-green-50',
    },
    {
      label: 'View Site Visit Calendar',
      icon: CalendarIcon,
      href: '/agent/site-visit-calendar',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's your property portfolio summary."
      />

      <div className="p-8 space-y-8">
        {/* Row 1 — Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(card => (
            <Card
              key={card.title}
              className="bg-white border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden"
            >
              <CardContent className="p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[14px] font-medium text-gray-400 capitalize">
                      {card.title}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-9 w-16 mt-2 mb-1" />
                    ) : (
                      <p className="text-4xl font-bold text-[#0D1B2A] mt-2 mb-1">
                        {card.value}
                      </p>
                    )}
                    <p className="text-[13px] text-gray-400 font-normal">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="bg-[#F4F6F8] p-3 rounded-2xl">
                    <card.icon className="h-6 w-6 text-[#0D1B2A]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Graph Section */}
        <Card className="bg-white border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-[#0D1B2A]">
                Total Listings
              </h2>
              <p className="text-sm text-gray-400">
                Monthly overview of your growth
              </p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg text-sm font-medium text-gray-500 cursor-pointer border border-gray-200 transition-colors">
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="outline-none bg-transparent cursor-pointer font-semibold text-[#0D1B2A]"
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <CalendarIcon className="h-4 w-4 ml-1" />
            </div>
          </div>

          <div className="h-[220px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={overview?.totalListingsByMonth ?? []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#e5e7eb"
                  vertical={true}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [value, 'Listings']}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#0D1B2A"
                  strokeWidth={2}
                  dot={{ fill: '#0D1B2A', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="pb-10">
          <h2 className="text-lg font-bold text-[#0D1B2A] mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map(action => (
              <Link key={action.label} href={action.href}>
                <div className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#0D1B2A]/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'p-3 rounded-xl transition-colors',
                        action.bgColor,
                      )}
                    >
                      <action.icon className="h-6 w-6 text-[#0D1B2A]" />
                    </div>
                    <span className="text-[16px] font-bold text-[#0D1B2A]">
                      {action.label}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#0D1B2A] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
