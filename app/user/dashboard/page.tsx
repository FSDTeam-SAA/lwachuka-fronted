'use client'
import {
  CalendarDays,
  Heart,
  MessageSquare,
  Bookmark,
  CalendarCheck,
  UserRound,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { dashboardKeys, getUserOverview } from '@/lib/queries/dashboard'
import { useRouter } from 'next/navigation'

type StatCardProps = {
  title: string
  value: string | number
  icon: React.ReactNode
}

type ActivityItem = {
  title: string
  time: string
}

type ActionItem = {
  title: string
  icon: React.ReactNode
  onClick?: () => void
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#EDF1F5] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[24px] font-semibold text-[#061F3D]">
            {value}
          </div>
          <div className="mt-2 text-[12px] text-[#424242]">{title}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9] text-[#1F2A37]">
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[#EDF1F5] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="h-8 w-16 rounded bg-gray-200"></div>
          <div className="mt-2 h-4 w-24 rounded bg-gray-200"></div>
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
      </div>
    </div>
  )
}

function QuickActionButton({ title, icon, onClick }: ActionItem) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md border border-[#4A5B73] bg-white px-3 py-2 text-[13px] font-medium text-[#1E2B3A] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-[#F7FAFC]"
    >
      <span className="text-[#F29B0B]">{icon}</span>
      <span>{title}</span>
    </button>
  )
}

function QuickActionSkeleton() {
  return (
    <div className="h-10 animate-pulse rounded-md border border-gray-200 bg-gray-100" />
  )
}

export default function UserDashboardOverview() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const currentYear = new Date().getFullYear()
  const router = useRouter()

  const { data: overviewData, isLoading } = useQuery({
    queryKey: dashboardKeys.overview(currentYear),
    queryFn: () => getUserOverview(token),
    enabled: !!token,
  })

  const topStats = [
    {
      title: 'Saved Properties',
      value: overviewData?.data?.savedProperties ?? 0,
      icon: <Heart className="h-4 w-4" />,
    },
    {
      title: 'Upcoming Site Visits',
      value: overviewData?.data?.upcommingSiteVisit ?? 0,
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      title: 'Recent Inquiries',
      value: overviewData?.data?.totalInquiries ?? 0,
      icon: <MessageSquare className="h-4 w-4" />,
    },
  ]

  const recentActivity: ActivityItem[] = [
    {
      title: 'Saved property for 3 Bedroom Apartment in Kilimani',
      time: '2 hours ago',
    },
    {
      title: 'Inquiry sent for 4 Bedroom Villa in Karen',
      time: '2 hours ago',
    },
    {
      title: 'Site visit booked for Penthouse in Westlands',
      time: '2 hours ago',
    },
  ]

  const quickActions: ActionItem[] = [
    {
      title: 'View Saved Properties',
      icon: <Bookmark className="h-4 w-4" />,
      onClick: () => router.push('/user/dashboard/saved-properties'),
    },
    {
      title: 'Book a Site Visit',
      icon: <CalendarCheck className="h-4 w-4" />,
      onClick: () => router.push('/user/dashboard/site-visit-calendar'),
    },
    {
      title: 'Update Profile',
      icon: <UserRound className="h-4 w-4" />,
      onClick: () => router.push('/user/dashboard/settings'),
    },
  ]

  return (
    <section className="w-full bg-[#F3F5F7]">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => <StatCardSkeleton key={i} />)
            : topStats.map(item => (
                <StatCard
                  key={item.title}
                  title={item.title}
                  value={item.value}
                  icon={item.icon}
                />
              ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-xl border border-[#EDF1F5] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <h2 className="text-[24px] font-normal text-[#181818]">
              Recent Activity
            </h2>
            <div className="mt-3 space-y-3">
              {recentActivity.map(item => (
                <div key={item.title} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#F29B0B]" />
                  <div>
                    <p className="text-[16px] text-[#424242]">{item.title}</p>
                    <p className="mt-1 text-[14px] text-[#9AA3AF]">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#EDF1F5] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <h2 className="text-[16px] font-semibold text-[#1F2A37]">
              Quick Actions
            </h2>
            <div className="mt-3 space-y-3">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => <QuickActionSkeleton key={i} />)
                : quickActions.map(item => (
                    <QuickActionButton
                      key={item.title}
                      title={item.title}
                      icon={item.icon}
                      onClick={item.onClick}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
