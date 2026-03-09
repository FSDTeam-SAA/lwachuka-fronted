'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getMyProperties, listingKeys } from '@/lib/queries/listings'
import { ListingTable } from '@/components/listing-management/ListingTable'
import { Pagination } from '@/components/shared/Pagination'

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
    <div className="p-8 max-w-full mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0D1B2A] mb-1">
          Listing Management
        </h1>
        <p className="text-sm text-gray-500">View all your approved listings</p>
      </div>

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
  )
}
