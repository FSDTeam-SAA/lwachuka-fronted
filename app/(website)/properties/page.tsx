import React, { Suspense } from 'react'
import { PropertyListingsSection } from './_components/PropertyListingsSection'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading properties...</div>}>
        <PropertyListingsSection />
      </Suspense>
    </div>
  )
}

export default page
