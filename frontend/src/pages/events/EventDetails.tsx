import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Ticket,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { eventsAPI, ticketsAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await eventsAPI.getById(id!);
      setEvent(response.data);
    } catch (error) {
      toast.error('Failed to fetch event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = async () => {
    setBooking(true);
    try {
      await ticketsAPI.book(id!);
      toast.success('Ticket booked successfully!');
      navigate('/bookings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book ticket');
    } finally {
      setBooking(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await eventsAPI.delete(id!);
      toast.success('Event deleted successfully');
      navigate('/events');
    } catch (error) {
      toast.error('Failed to delete event');
    }
    setDeleteDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-700';
      case 'ONGOING':
        return 'bg-green-100 text-green-700';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="h-96 bg-gray-200"></div>
          <div className="p-8 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const canEdit = user?.role === 'ADMIN' || (user?.role === 'ORGANIZER' && event.organizerId === user?.id);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      {/* Event Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {/* Banner */}
        <div className="h-96 bg-gray-200 overflow-hidden relative">
          {event.bannerUrl ? (
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center">
              <Calendar className="h-24 w-24 text-white opacity-30" />
            </div>
          )}
          <div className="absolute top-6 right-6">
            <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#FEF3F2] text-[#EA580C] text-sm font-medium rounded-lg">
                  {event.category}
                </span>
              </div>
              <h1 className="text-3xl font-semibold text-[#0F172A] mb-4">{event.title}</h1>
              <p className="text-[#64748B] text-lg leading-relaxed">{event.description}</p>
            </div>

            {canEdit && (
              <div className="flex gap-2 ml-6">
                <Link
                  to={`/events/edit/${event.id}`}
                  className="p-2 text-[#64748B] hover:text-[#EA580C] hover:bg-[#FEF3F2] rounded-lg transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => setDeleteDialogOpen(true)}
                  className="p-2 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 bg-[#FEF3F2] rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-[#EA580C]" />
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Start Time</p>
                <p className="font-medium text-[#0F172A]">
                  {format(new Date(event.startTime), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-[#64748B]">
                  {format(new Date(event.startTime), 'hh:mm a')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-12 w-12 bg-[#FEF3F2] rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-[#EA580C]" />
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">End Time</p>
                <p className="font-medium text-[#0F172A]">
                  {format(new Date(event.endTime), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-[#64748B]">
                  {format(new Date(event.endTime), 'hh:mm a')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-12 w-12 bg-[#FEF3F2] rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-[#EA580C]" />
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Venue</p>
                <p className="font-medium text-[#0F172A]">{event.venue}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-12 w-12 bg-[#FEF3F2] rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-[#EA580C]" />
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Max Attendees</p>
                <p className="font-medium text-[#0F172A]">{event.maxAttendees}</p>
              </div>
            </div>
          </div>

          {/* Book Ticket Button */}
          {/* {event.status === 'UPCOMING' && user?.role === 'USER' && ( */}
          {event.status === 'UPCOMING' && (
            <button
              onClick={handleBookTicket}
              disabled={booking}
              className="w-full md:w-auto px-8 py-3 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Ticket className="h-5 w-5" />
              {booking ? 'Booking...' : 'Book Ticket'}
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-[#0F172A] mb-2">
                  Delete Event
                </Dialog.Title>
                <Dialog.Description className="text-sm text-[#64748B]">
                  Are you sure you want to delete this event? This action cannot be undone.
                </Dialog.Description>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C] transition-colors font-medium"
              >
                Delete Event
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
