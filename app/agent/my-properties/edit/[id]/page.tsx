'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { propertyKeys, getPropertyById } from '@/lib/queries/properties'
import { PropertyForm } from '@/components/properties/PropertyForm'
import { Skeleton } from '@/components/ui/skeleton'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function EditPropertyPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { data: session } = useSession()
  const token = session?.user?.accessToken

  const { data, isLoading, isError } = useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => getPropertyById(id),
    enabled: !!token && !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Property Listing"
          subtitle="Update your property information"
          backHref="/agent/my-properties"
        />
        <div className="p-8 max-w-full mx-auto space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="space-y-10">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <DashboardHeader
          title="Edit Property Listing"
          subtitle="Update your property information"
          backHref="/agent/my-properties"
        />
        <div className="p-8 max-w-full mx-auto text-center">
          <p className="text-red-500 font-medium">
            Failed to load property details. It might have been deleted or moved.
          </p>
          <button
            onClick={() => router.push('/agent/my-properties')}
            className="text-[#0B2B4B] font-bold mt-4 underline"
          >
            Back to My Properties
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Edit Property Listing"
        subtitle="Update your property information"
        backHref="/agent/my-properties"
      />

      <div className="p-8 max-w-full mx-auto space-y-8">
        <PropertyForm
          mode="edit"
          propertyId={id}
          initialData={data?.data}
          onSuccess={() => router.push('/agent/my-properties')}
        />
      </div>
    </div>
  )
}
