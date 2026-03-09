/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { CreditCard, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'

export function PromotionStats() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken

  // Profile data for plan info
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['user-profile', token],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (!res.ok) throw new Error('Failed to fetch profile')
      const json = await res.json()
      return json?.data
    },
  })

  // Payment history for total spent
  const { data: payments, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['my-payments', token],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (!res.ok) throw new Error('Failed to fetch payments')
      const json = await res.json()
      return json?.data || []
    },
  })

  if (isProfileLoading || isPaymentsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  // Plan info
  const planName = profile?.subscribers?.name || 'No Active Plan'
  const planPrice = profile?.subscribers?.price
    ? `KSH ${profile.subscribers.price}`
    : 'KSH 0'

  // Expiration Date
  const expiryDate = profile?.subscriptionEndDate
    ? new Date(profile.subscriptionEndDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'No Active Subscription'

  // Total Spent
  const totalSpent = Array.isArray(payments)
    ? payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
    : 0

  const stats = [
    {
      icon: <CreditCard className="h-6 w-6 text-[#061F3D]" />,
      title: planName,
      subtitle: `${planPrice}${profile?.subscribers?.name ? ' (Current Plan)' : ''}`,
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#061F3D]" />,
      title: expiryDate,
      subtitle: profile?.subscriptionEndDate
        ? 'Expiration Date'
        : 'Join a plan to boost visibility',
    },
    {
      icon: <DollarSign className="h-6 w-6 text-[#061F3D]" />,
      title: `KSH ${totalSpent.toLocaleString()}`,
      subtitle: 'Total Spent (All time)',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-[#061F3D]">{stat.title}</h3>
              <p className="text-sm text-gray-500 font-medium">
                {stat.subtitle}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
