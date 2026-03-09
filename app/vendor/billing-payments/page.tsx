import React from 'react'
import BillingPaymentsCard from './_components/BillingPaymentsCard'
import BillingPaymentsPlan from './_components/BillingPaymentsPlan'

function page() {
  return (
    <div>
        <BillingPaymentsCard />
        <div>
            <BillingPaymentsPlan />
        </div>
    </div>
  )
}

export default page