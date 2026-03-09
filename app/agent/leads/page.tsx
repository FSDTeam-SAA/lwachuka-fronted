'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getLeads, leadKeys } from '@/lib/queries/leads'
import { LeadStatCards } from '@/components/leads/LeadStatCards'
import { LeadRow } from '@/components/leads/LeadRow'
import { LeadContactModal } from '@/components/leads/LeadContactModal'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2 } from 'lucide-react'

export default function LeadsPage() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

  const { data: leadsData, isLoading } = useQuery({
    queryKey: leadKeys.list(),
    queryFn: () => getLeads(token),
    enabled: !!token,
  })

  const leads = leadsData?.data || []
  const meta = leadsData?.meta

  const handleContactClick = (id: string) => {
    setSelectedLeadId(id)
  }

  const handleCloseModal = () => {
    setSelectedLeadId(null)
  }

  return (
    <div className="p-8 max-w-full mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0D1B2A] mb-1">
          Leads & Enquiries
        </h1>
        <p className="text-sm text-gray-500">
          Manage and respond to property inquiries
        </p>
      </div>

      {/* Stat Cards */}
      <LeadStatCards />

      {/* Leads List Section */}
      <div className="mb-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.02)]">
        <h2 className="text-sm font-semibold text-gray-900 mb-5">
          All Leads ({meta?.total || leads.length})
        </h2>

        {isLoading ? (
          <div className="space-y-4 shadow-sm border border-gray-100 p-2 rounded-xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex p-5 gap-4 items-center">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="w-full">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-8 w-24 shrink-0" />
              </div>
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.06)] border border-gray-100 flex flex-col items-center">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No Leads Yet
            </h3>
            <p className="text-sm text-gray-500">
              You don&apos;t have any property inquiries at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <LeadRow
                key={lead._id}
                lead={lead}
                onContactClick={handleContactClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Profile Contact */}
      {selectedLeadId && (
        <LeadContactModal leadId={selectedLeadId} onClose={handleCloseModal} />
      )}
    </div>
  )
}
