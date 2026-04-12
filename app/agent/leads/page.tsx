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
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

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
    <div className="min-h-screen">
      <DashboardHeader
        title="Leads & Enquiries"
        subtitle="Manage and respond to property inquiries"
      />

      <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* Stat Cards */}
        <div className="mb-4 sm:mb-5 lg:mb-6">
          <LeadStatCards />
        </div>

        {/* Leads List Section */}
        <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.02)] sm:rounded-2xl sm:p-5 lg:p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 sm:mb-5">
            All Leads ({meta?.total || leads.length})
          </h2>

          {isLoading ? (
            <div className="space-y-3 rounded-xl border border-gray-100 p-2 shadow-sm sm:space-y-4 sm:p-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg p-3 sm:gap-4 sm:p-5"
                >
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12" />

                  <div className="min-w-0 flex-1">
                    <Skeleton className="mb-2 h-4 w-28 sm:w-40" />
                    <Skeleton className="h-3 w-32 sm:w-64" />
                  </div>

                  <Skeleton className="h-8 w-20 shrink-0 sm:w-24" />
                </div>
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white px-4 py-14 text-center shadow-[0_2px_8px_-3px_rgba(6,81,237,0.06)] sm:px-6 sm:py-16 lg:py-20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 sm:h-16 sm:w-16">
                <Building2 className="h-7 w-7 text-gray-400 sm:h-8 sm:w-8" />
              </div>

              <h3 className="mb-1 text-base font-semibold text-gray-900 sm:text-lg">
                No Leads Yet
              </h3>

              <p className="max-w-md text-sm leading-6 text-gray-500">
                You don&apos;t have any property inquiries at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
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
          <LeadContactModal
            leadId={selectedLeadId}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  )
}