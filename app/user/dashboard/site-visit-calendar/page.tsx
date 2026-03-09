/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import {
  CalendarDays,
  Eye,
  X,
  MapPin,
  Clock3,
  User,
  AlertCircle,
  Phone,
} from 'lucide-react'

type UpcomingVisit = {
  id: number
  title: string
  location: string
  date: string
  time: string
  agent: string
  contact: string
  note: string
  status: 'Upcoming'
}

type PastVisit = {
  id: number
  title: string
  location: string
  date: string
  status: 'Completed'
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
console.log(cn)

function StatCard({
  value,
  label,
  icon,
}: {
  value: number
  label: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#E9E9E9] bg-white px-4 py-5 shadow-[0_4px_14px_rgba(15,23,42,0.06)] sm:px-5 sm:py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[28px] font-bold leading-none text-[#0B2239] sm:text-[32px]">
            {value}
          </h3>
          <p className="mt-2 text-[12px] text-[#5E6773] sm:text-[13px]">
            {label}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3FAFF] text-[#0B2239] sm:h-11 sm:w-11">
          {icon}
        </div>
      </div>
    </div>
  )
}

function UpcomingVisitCard({
  item,
  onCancel,
}: {
  item: UpcomingVisit
  onCancel?: (item: UpcomingVisit) => void
}) {
  return (
    <div className="rounded-2xl border border-[#E9E9E9] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[16px] font-medium text-[#2E353A] sm:text-[18px]">
          {item.title}
        </h3>

        <span className="shrink-0 rounded-full bg-[#EAFBF1] px-3 py-1 text-[11px] font-medium text-[#55C28A]">
          {item.status}
        </span>
      </div>

      <div className="mt-4 space-y-2.5 text-[12px] text-[#8B8F97] sm:text-[13px]">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-[#8B8F97]" />
          <span>{item.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-[#8B8F97]" />
          <span>{item.date}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 text-[#8B8F97]" />
          <span>{item.time}</span>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-[#8B8F97]" />
          <span>{item.agent}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#FBF4E7] font-medium px-3 py-3 text-[14px] text-[#D3920E]">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{item.note}</span>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="h-11 flex-1 rounded-lg border-2 border-[#061F3D] bg-white text-[14px] font-medium text-[#061F3D] hover:bg-slate-50"
        >
          View Details
        </button>

        <button
          type="button"
          onClick={() => onCancel?.(item)}
          className="h-11 rounded-lg bg-[#E5533D] px-4 text-[13px] font-medium text-white hover:bg-[#ea4f33] sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function PastVisitRow({ item }: { item: PastVisit }) {
  return (
    <div className="rounded-xl border border-[#ECECEC] bg-white px-4 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.05)] sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[15px] font-medium text-[#2E353A] sm:text-[16px]">
              {item.title}
            </h4>
            <span className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[10px] font-medium text-[#6F8DFF]">
              {item.status}
            </span>
          </div>

          <p className="mt-2 text-[12px] text-[#9A9FA8] sm:text-[13px]">
            {item.location}
            <span className="mx-2">•</span>
            {item.date}
          </p>
        </div>

        <button
          type="button"
          className="text-left text-[12px] font-medium text-[#6E737B] hover:text-[#0B2239] sm:text-right"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default function SiteVisitsClone() {
  const [selectedVisit, setSelectedVisit] = useState<UpcomingVisit | null>(null)

  const stats = [
    {
      value: 3,
      label: 'Upcoming Visits',
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      value: 1,
      label: 'Completed',
      icon: <Eye className="h-5 w-5" />,
    },
    {
      value: 1,
      label: 'Canceled',
      icon: <X className="h-5 w-5" />,
    },
  ]

  const upcomingVisits: UpcomingVisit[] = [
    {
      id: 1,
      title: '3 Bedroom Apartment in Kilimani',
      location: 'Kilimani, Nairobi',
      date: 'Saturday, February 10, 2024',
      time: '10:00 AM',
      agent: 'Sarah Mwangi',
      contact: '+254 712 345 678',
      note: 'Bring ID and proof of income',
      status: 'Upcoming',
    },
    {
      id: 2,
      title: '3 Bedroom Apartment in Kilimani',
      location: 'Kilimani, Nairobi',
      date: 'Saturday, February 10, 2024',
      time: '10:00 AM',
      agent: 'Sarah Mwangi',
      contact: '+254 712 345 678',
      note: 'Bring ID and proof of income',
      status: 'Upcoming',
    },
    {
      id: 3,
      title: '3 Bedroom Apartment in Kilimani',
      location: 'Kilimani, Nairobi',
      date: 'Saturday, February 10, 2024',
      time: '10:00 AM',
      agent: 'Sarah Mwangi',
      contact: '+254 712 345 678',
      note: 'Bring ID and proof of income',
      status: 'Upcoming',
    },
  ]

  const pastVisits: PastVisit[] = [
    {
      id: 1,
      title: '2 Bedroom Townhouse in Lavington',
      location: 'Lavington, Nairobi',
      date: 'Monday, February 5, 2024 at 3:00 PM',
      status: 'Completed',
    },
    {
      id: 2,
      title: '2 Bedroom Townhouse in Lavington',
      location: 'Lavington, Nairobi',
      date: 'Monday, February 5, 2024 at 3:00 PM',
      status: 'Completed',
    },
  ]

  const handleCancel = (id: number) => {
    console.log('Cancel visit:', id)
  }

  return (
    <section className="w-full bg-[#F8F8F8]">
      <div className="mx-auto container px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Top stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map(item => (
            <StatCard
              key={item.label}
              value={item.value}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Upcoming */}
        <div className="mt-6">
          <h2 className="text-[22px] font-medium text-[#2E353A] sm:text-[24px]">
            Upcoming Site Visits
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
            {upcomingVisits.map(item => (
              <UpcomingVisitCard
                key={item.id}
                item={item}
                onCancel={setSelectedVisit}
              />
            ))}
          </div>
        </div>

        {/* Past */}
        <div className="mt-6">
          <h2 className="text-[22px] font-medium text-[#2E353A] sm:text-[24px]">
            Past Site Visits
          </h2>

          <div className="mt-4 space-y-4">
            {pastVisits.map(item => (
              <PastVisitRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
            <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#1F2A37]">
                  {selectedVisit.title}
                </h2>
                <span className="mt-2 inline-flex rounded-full bg-[#EAFBF1] px-2.5 py-1 text-[10px] font-medium text-[#55C28A]">
                  {selectedVisit.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVisit(null)}
                className="rounded-full p-1 text-[#98A2B3] transition hover:bg-[#F2F4F7]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-t border-[#EEF2F6] px-5 py-4 sm:px-6">
              <div className="space-y-3 text-[12px] text-[#4B5563]">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 text-[#8B8F97]" />
                  <div>
                    <div className="text-[16px] text-[#6A7282]">Location</div>
                    <div className="text-[#101828] text-base">
                      {selectedVisit.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 h-3.5 w-3.5 text-[#8B8F97]" />
                  <div>
                    <div className="text-[16px] text-[#6A7282]">Date</div>
                    <div className="text-[#101828] text-base">
                      {selectedVisit.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock3 className="mt-0.5 h-3.5 w-3.5 text-[#8B8F97]" />
                  <div>
                    <div className="text-[16px] text-[#6A7282]">Time</div>
                    <div className="text-[#101828] text-base">
                      {selectedVisit.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-3.5 w-3.5 text-[#8B8F97]" />
                  <div>
                    <div className="text-[16px] text-[#6A7282]">Agent</div>
                    <div className="text-[#101828] text-base">
                      {selectedVisit.agent}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-3.5 w-3.5 text-[#8B8F97]" />
                  <div>
                    <div className="text-[16px] text-[#6A7282]">Contact</div>
                    <div className="text-[#101828] text-base">
                      {selectedVisit.contact}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border-2 border-[#E5E7EB] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-2 text-[16px] text-[#6A7282]">
                  <AlertCircle className="h-3.5 w-3.5 text-[#8B8F97]" />
                  <span>Important Notes</span>
                </div>
                <p className="mt-2 text-[16px] text-[]">{selectedVisit.note}</p>
              </div>
            </div>

            <div className="border-t border-[#EEF2F6] px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-lg border-2 border-[#1F2A37] bg-white px-4 py-2 text-[13px] font-medium text-[#1F2A37]"
                >
                  View Property
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCancel(selectedVisit.id)
                    setSelectedVisit(null)
                  }}
                  className="flex w-full items-center justify-center rounded-lg bg-[#E5533D] px-4 py-2 text-[13px] font-medium text-white"
                >
                  Cancel Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
