'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { propertyKeys, getMyProperties } from '@/lib/queries/properties'
import { PropertyCard } from '@/components/common/PropertyCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function MyPropertiesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const token = session?.user?.accessToken

  const { data, isLoading, isError } = useQuery({
    queryKey: propertyKeys.myList(),
    queryFn: () => getMyProperties(),
    enabled: !!token,
  })

  const properties = data?.data || []

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="My Properties"
        subtitle="Manage all your property listings"
      >
        <Button
          onClick={() => router.push('/agent/create-property')}
          className="bg-[#0B2B4B] text-white hover:bg-[#0B2B4B]/90 h-10 px-6 rounded-full flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Create Property Listing
        </Button>
      </DashboardHeader>

      <div className="p-8 max-w-full mx-auto space-y-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-[500px] w-full rounded-[28px]" />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 p-8 rounded-2xl text-center border border-red-100">
            <p className="text-red-600 font-medium">
              Failed to load properties. Please try again later.
            </p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white p-20 rounded-2xl text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg">
              You haven&apos;t added any properties yet.
            </p>
            <Button
              variant="link"
              onClick={() => router.push('/agent/create-property')}
              className="text-[#0B2B4B] font-bold mt-2"
            >
              Add your first property now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <PropertyCard
                key={property._id}
                id={property._id}
                image={property.images[0] || '/images/placeholder-property.jpg'}
                title={property.title}
                location={property.location}
                price={`KES ${property.price.toLocaleString()}`}
                beds={property.bedrooms}
                baths={property.bathrooms}
                acres={property.acres}
                status={property.listingType}
                isAgentView={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
