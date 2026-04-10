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

      <div className="p-4 sm:p-6 lg:p-8 max-w-full mx-auto">
        {/* Table Component */}
        <div className="-mx-4 sm:mx-0 overflow-x-auto">
          <div className="min-w-[720px] px-4 sm:px-0">
            <ListingTable data={data?.data} isLoading={isLoading} />
          </div>
        </div>

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
