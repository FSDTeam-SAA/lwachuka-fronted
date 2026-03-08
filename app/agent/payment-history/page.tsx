'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getMyPayments, paymentKeys } from '@/lib/queries/payments'
import { PaymentTable } from '@/components/payment-history/PaymentTable'
import { PaymentStatCards } from '@/components/payment-history/PaymentStatCards'
import { Pagination } from '@/components/shared/Pagination'

export default function PaymentHistoryPage() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: paymentKeys.list(currentPage),
    queryFn: () => getMyPayments(currentPage, token),
    enabled: !!token,
  })

  // Calculate stats from the current page's data
  // TODO: Replace with dedicated stats API endpoint when available from backend
  const payments = data?.data || []

  const totalSpent = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const completedPayments = payments.filter(
    (p) => p.status === 'completed'
  ).length
  const pendingPayments = payments.filter((p) => p.status === 'pending').length

  const totalPages = Math.ceil((data?.meta.total ?? 0) / 10)
  const totalItems = data?.meta.total ?? 0

  return (
    <div className="p-8 max-w-full mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0D1B2A] mb-1">
          Payment History
        </h1>
        <p className="text-sm text-gray-500">
          View all your payment transactions and receipts
        </p>
      </div>

      {/* Stat Cards */}
      <PaymentStatCards
        totalSpent={totalSpent}
        completedPayments={completedPayments}
        pendingPayments={pendingPayments}
        isLoading={isLoading}
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
  )
}
