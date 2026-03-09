'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getSubscriptions, promotionKeys } from '@/lib/queries/promotions'
import { Subscription } from '@/types/promotions'
import { SubscriptionCard } from '@/components/promotions/SubscriptionCard'
import { SubscriptionCardSkeleton } from '@/components/promotions/SubscriptionCardSkeleton'
import { MpesaPaymentModal } from '@/components/promotions/MpesaPaymentModal'

export default function PromotionsPage() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken

  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: promotionKeys.subscriptions(),
    queryFn: () => getSubscriptions(token),
    enabled: !!token,
  })

  const handleBuyNow = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSubscription(null)
  }

  // Sort by price ascending
  const sortedSubscriptions = data?.data
    ? [...data.data].sort((a, b) => a.price - b.price)
    : []

  return (
    <div className="p-8 max-w-full mx-auto">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-black text-[#0D1B2A] mb-2 tracking-tight">
          Promotions
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Boost your property visibility with premium advertising
        </p>
      </div>

      <div className="space-y-12">
        {/* Section Title */}
        <div className="text-left">
          <h2 className="text-2xl font-bold text-[#0D1B2A] mb-1">
            Boost Your Properties
          </h2>
          <p className="text-sm text-gray-500">
            Increase visibility and get more leads with our promotion packages
          </p>
        </div>

        {/* Card Grid */}
        {isLoading ? (
          <SubscriptionCardSkeleton />
        ) : sortedSubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-10">
            {sortedSubscriptions.map((sub, index) => (
              <SubscriptionCard
                key={sub._id}
                subscription={sub}
                index={index}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center border-dashed">
            <h3 className="text-lg font-bold text-[#0D1B2A] mb-1">
              No Promotion Packages
            </h3>
            <p className="text-sm text-gray-500">
              Packages will appear here once configured by admin.
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <MpesaPaymentModal
        subscription={selectedSubscription}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
