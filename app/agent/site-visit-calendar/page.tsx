'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import {
  getAgentBookings,
  calendarKeys,
  updateBookingStatus,
} from '@/lib/queries/calendar'
import { CalendarGrid } from '@/components/site-visit-calendar/CalendarGrid'
import { UpcomingSiteVisits } from '@/components/site-visit-calendar/UpcomingSiteVisits'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { BookingStatus } from '@/types/calendar'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function SiteVisitCalendarPage() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const queryClient = useQueryClient()

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null)

  // Fetch pending bookings
  const { data, isLoading } = useQuery({
    queryKey: calendarKeys.bookings('pending'),
    queryFn: () => getAgentBookings('pending', token),
    enabled: !!token,
  })

  // Extract booked dates for calendar indicators
  const bookedDates =
    data?.data.map((b) => format(new Date(b.moveInData), 'yyyy-MM-dd')) || []

  // Mutation for status update
  const statusMutation = useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: {
      bookingId: string
      status: BookingStatus
    }) => updateBookingStatus(bookingId, { status }, token),
    onMutate: (variables) => {
      setPendingBookingId(variables.bookingId)
    },
    onSuccess: (_, variables) => {
      const action = variables.status === 'approved' ? 'approved' : 'declined'
      toast.success(`Booking ${action} successfully`)
      queryClient.invalidateQueries({
        queryKey: calendarKeys.bookings('pending'),
      })
    },
    onError: () => {
      toast.error('Failed to update booking status')
    },
    onSettled: () => {
      setPendingBookingId(null)
    },
  })

  const handleApprove = (bookingId: string) => {
    statusMutation.mutate({ bookingId, status: 'approved' })
  }

  const handleDecline = (bookingId: string) => {
    // Backend uses 'cancelled' for Declined status
    statusMutation.mutate({ bookingId, status: 'cancelled' })
  }

  // Filter bookings based on selected date
  // If no date is selected or filtered list is empty, show all pending
  const filteredBookings = selectedDate
    ? data?.data.filter(
      (b) =>
        format(new Date(b.moveInData), 'yyyy-MM-dd') ===
        format(selectedDate, 'yyyy-MM-dd')
    ) || []
    : data?.data || []

  const displayBookings =
    selectedDate && filteredBookings.length > 0
      ? filteredBookings
      : data?.data || []

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Site Visit Calendar"
        subtitle="Manage site visit requests from potential buyers and renters"
      />

      <div className="p-8 max-w-full mx-auto">

        {/* Calendar Grid */}
        <CalendarGrid
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          bookedDates={bookedDates}
        />

        {/* Upcoming Visits List */}
        <UpcomingSiteVisits
          bookings={displayBookings}
          isLoading={isLoading}
          selectedDate={selectedDate}
          pendingBookingId={pendingBookingId}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      </div>
    </div>
  )
}
