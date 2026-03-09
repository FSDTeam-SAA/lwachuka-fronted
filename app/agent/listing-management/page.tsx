'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getMyProperties, listingKeys } from '@/lib/queries/listings'
import { ListingTable } from '@/components/listing-management/ListingTable'
import { Pagination } from '@/components/shared/Pagination'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function ListingManagementPage() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: listingKeys.list(currentPage),
    queryFn: () => getMyProperties(currentPage, token),
    enabled: !!token,
  })

  const totalPages = Math.ceil((data?.meta.total ?? 0) / 10)
  const totalItems = data?.meta.total ?? 0

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Listing Management"
        subtitle="View all your approved listings"
      />

      <div className="p-8 max-w-full mx-auto">

        {/* Table Component */}
        <ListingTable data={data?.data} isLoading={isLoading} />

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
