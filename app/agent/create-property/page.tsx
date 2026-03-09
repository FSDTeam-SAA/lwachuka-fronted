'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
import { PropertyForm } from '@/components/properties/PropertyForm'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function CreatePropertyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Create New Property Listing"
        subtitle="Add a new property to your portfolio"
        backHref="/agent/my-properties"
      />

      <div className="p-8 max-w-full mx-auto space-y-8">
        <PropertyForm
          mode="create"
          onSuccess={() => router.push('/agent/my-properties')}
        />
      </div>
    </div>
  )
}
