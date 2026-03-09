'use client'

import {
  Building2,
  Eye,
  CalendarDays,
  List,
  PlusCircle,
  Calendar,
  // TrendingUp,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { dashboardKeys, getAgentOverview } from '@/lib/queries/dashboard'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { cn } from '@/lib/utils'
import {
  // LineChart,
  // Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

const dummyChartData = [
  { name: 'JAN', value: 10 },
  { name: 'FEB', value: 13 },
  { name: 'MAR', value: 16 },
  { name: 'APR', value: 13 },
  { name: 'MAY', value: 10 },
  { name: 'JUN', value: 8 },
  { name: 'JUL', value: 5 },
  { name: 'AUG', value: 10 },
  { name: 'SEP', value: 20 },
]

export default function AgentDashboard() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken

  const { data: overviewData, isLoading } = useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () => getAgentOverview(token),
    enabled: !!token,
  })

  const stats = [
    {
      title: 'Total Property Listings',
      value: overviewData?.data?.totalProperty || 0,
      subtitle: 'All properties in your portfolio',
      icon: Building2,
    },
    {
      title: 'Active Listings',
      value: overviewData?.data?.activeProperty || 0,
      subtitle: 'Currently visible to buyers',
      icon: Eye,
    },
    {
      title: 'Upcoming Site Visits',
      value: overviewData?.data?.upCommingSiteViste || 0,
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
      icon: Calendar,
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
                    <p className="text-4xl font-bold text-[#0D1B2A] mt-2 mb-1">
                      {isLoading ? '...' : card.value}
                    </p>
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
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors">
              2024 <Calendar className="h-4 w-4" />
            </div>
          </div>

          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D1B2A" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0D1B2A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F0F0F0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0D1B2A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  dot={{
                    r: 4,
                    fill: '#0D1B2A',
                    strokeWidth: 2,
                    stroke: '#fff',
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
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
