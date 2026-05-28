import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Clock, X, AlertCircle } from 'lucide-react';
import { ticketsAPI } from '../../services/api';
import { toast } from 'sonner';
import { format, isValid } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await ticketsAPI.getMyTickets();
      console.log(response.data);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedTicket) return;

    setCanceling(true);
    try {
      await ticketsAPI.cancel(selectedTicket);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCanceling(false);
      setCancelDialogOpen(false);
      setSelectedTicket(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatBookingDate = (date: string): string => {
    const parsedDate = new Date(date);
    if (!isValid(parsedDate)) return "-";
    return format(parsedDate, "MMM dd, yyyy • hh:mm a");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">My Bookings</h1>
        <p className="text-[#64748B]">View and manage your event tickets</p>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="h-24 w-32 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
          <Ticket className="h-16 w-16 text-[#E2E8F0] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No bookings yet</h3>
          <p className="text-[#64748B] mb-6">Start exploring events and book your tickets</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Event Banner */}
                  <Link
                    to={`/events/${booking.eventId}`}
                    className="flex-shrink-0"
                  >
                    <div className="h-32 w-40 bg-gray-200 rounded-lg overflow-hidden">
                      {booking.bannerUrl ? (
                        <img
                          src={booking.bannerUrl}
                          alt={booking.eventTitle}
                          className="h-full w-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center">
                          <Calendar className="h-12 w-12 text-white opacity-50" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Booking Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link
                          to={`/events/${booking.eventId}`}
                          className="text-xl font-semibold text-[#0F172A] hover:text-[#EA580C] transition-colors"
                        >
                          {booking.eventTitle}
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-[#FEF3F2] text-[#EA580C] text-xs font-medium rounded">
                            {booking.eventCategory}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {booking.status === 'BOOKED' && (
                        <button
                          onClick={() => {
                            setSelectedTicket(booking.id);
                            setCancelDialogOpen(true);
                          }}
                          className="p-2 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                          title="Cancel booking"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#64748B]">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{booking.eventStartDateTime ? formatBookingDate(booking.eventStartDateTime) : "Yet to be announced"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{booking.venue ? booking.venue : "Yet to be announced"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4" />
                        <span>Ticket ID: {booking.id.substring(0, 8)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.bookingTime ? formatBookingDate(booking.bookingTime) : "Yet to be announced"}</span>
                        {/* <span>Booked: {format(new Date(booking.bookingTime), 'MMM dd, yyyy • hh:mm a')}</span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog.Root open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-[#0F172A] mb-2">
                  Cancel Booking
                </Dialog.Title>
                <Dialog.Description className="text-sm text-[#64748B]">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </Dialog.Description>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCancelDialogOpen(false)}
                disabled={canceling}
                className="px-4 py-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={canceling}
                className="px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C] transition-colors font-medium disabled:opacity-50"
              >
                {canceling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
