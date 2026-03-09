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
  const [currentPage, setCurrentPage] = useState(1)

  const { data: pendingData, isLoading: isPendingLoading } = useQuery({
    queryKey: calendarKeys.bookings('pending', currentPage),
    queryFn: () => getAgentBookings('pending', token, currentPage, 4),
    enabled: !!token,
  })

  const { data: approvedData, isLoading: isApprovedLoading } = useQuery({
    queryKey: calendarKeys.bookings('approved', currentPage),
    queryFn: () => getAgentBookings('approved', token, currentPage, 4),
    enabled: !!token,
  })

  // Combine and sort both pending and approved bookings
  const allBookings = [
    ...(pendingData?.data || []),
    ...(approvedData?.data || []),
  ].sort((a, b) => new Date(a.moveInData).getTime() - new Date(b.moveInData).getTime())

  const isLoading = isPendingLoading || isApprovedLoading

  // Pagination meta (using pending data's meta as base since we request same page size)
  // Taking max to ensure we show highest possible pages if one list is longer
  const pendingMeta = pendingData?.meta || { total: 0 }
  const approvedMeta = approvedData?.meta || { total: 0 }
  const totalItems = pendingMeta.total + approvedMeta.total;
  const totalPages = Math.ceil(totalItems / 4);

  // Extract booked dates for calendar indicators
  const bookedDates =
    allBookings.map((b) => format(new Date(b.moveInData), 'yyyy-MM-dd')) || []

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
      const action = variables.status === 'approved' ? 'approved' : variables.status === 'pending' ? 'reverted to pending' : 'declined'
      toast.success(`Booking ${action} successfully`)
      queryClient.invalidateQueries({
        queryKey: calendarKeys.bookings('pending'),
      })
      queryClient.invalidateQueries({
        queryKey: calendarKeys.bookings('approved'),
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

  const handleRevert = (bookingId: string) => {
    statusMutation.mutate({ bookingId, status: 'pending' })
  }

  // Filter bookings based on selected date
  // If no date is selected or filtered list is empty, show all relevant bookings
  const filteredBookings = selectedDate
    ? allBookings.filter(
      (b) =>
        format(new Date(b.moveInData), 'yyyy-MM-dd') ===
        format(selectedDate, 'yyyy-MM-dd')
    ) || []
    : allBookings || []

  const displayBookings =
    selectedDate && filteredBookings.length > 0
      ? filteredBookings
      : allBookings || []

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
          onRevert={handleRevert}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
