'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getMyPayments, getAllMyPayments, paymentKeys } from '@/lib/queries/payments'
import { PaymentTable } from '@/components/payment-history/PaymentTable'
import { PaymentStatCards } from '@/components/payment-history/PaymentStatCards'
import { Pagination } from '@/components/shared/Pagination'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function PaymentHistoryPage() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: paymentKeys.list(currentPage),
    queryFn: () => getMyPayments(currentPage, token),
    enabled: !!token,
  })

  // query for all payments to calculate global stats
  const { data: allData, isLoading: isStatsLoading } = useQuery({
    queryKey: paymentKeys.stats(),
    queryFn: () => getAllMyPayments(token),
    enabled: !!token,
  })

  const payments = data?.data || []
  const allPayments = allData?.data || []

  // Calculate stats from the full data set instead of paginated data
  const totalSpent = allPayments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const completedPayments = allPayments.filter(
    (p) => p.status === 'completed'
  ).length
  const pendingPayments = allPayments.filter((p) => p.status === 'pending').length

  const totalPages = Math.ceil((data?.meta.total ?? 0) / 10)
  const totalItems = data?.meta.total ?? 0

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Payment History"
        subtitle="View all your payment transactions and receipts"
      />

      <div className="p-8 max-w-full mx-auto">

        {/* Stat Cards */}
        <PaymentStatCards
          totalSpent={totalSpent}
          completedPayments={completedPayments}
          pendingPayments={pendingPayments}
          isLoading={isStatsLoading}
        />

        {/* Table Component */}
        <PaymentTable data={payments} isLoading={isLoading} />

        {/* Pagination Component */}
        {!isLoading && totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
          />
        )}
      </div>
    </div>
  )
}
