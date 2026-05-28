import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Plus, Search, Filter, Clock } from 'lucide-react';
import { eventsAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';

const categories = [
  'ALL',
  'TECHNOLOGY',
  'MUSIC',
  'SPORTS',
  'EDUCATION',
  'BUSINESS',
  'WORKSHOP',
  'ENTERTAINMENT',
  'CULTURAL',
];

const statuses = ['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

export default function Events() {
  const { user } = useAuthStore();
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, selectedCategory, selectedStatus]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events');
      // Demo mode - use mock data
      const mockEvents = [
        {
          id: '1',
          title: 'Tech Summit 2024',
          description: 'Annual technology conference featuring industry leaders and innovators discussing the future of tech',
          venue: 'Convention Center, San Francisco',
          category: 'TECHNOLOGY',
          status: 'UPCOMING',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
          maxAttendees: 500,
          bannerUrl: '',
        },
        {
          id: '2',
          title: 'Summer Music Festival',
          description: 'Experience the best live music performances from top artists and emerging talents',
          venue: 'Central Park Amphitheater',
          category: 'MUSIC',
          status: 'UPCOMING',
          startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          maxAttendees: 1000,
          bannerUrl: '',
        },
        {
          id: '3',
          title: 'Business Workshop',
          description: 'Learn essential business strategies, leadership skills, and networking techniques',
          venue: 'Downtown Business Center',
          category: 'BUSINESS',
          status: 'UPCOMING',
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          maxAttendees: 100,
          bannerUrl: '',
        },
        {
          id: '4',
          title: 'Sports Championship',
          description: 'Annual regional sports championship featuring multiple competitive events',
          venue: 'City Stadium',
          category: 'SPORTS',
          status: 'ONGOING',
          startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          maxAttendees: 2000,
          bannerUrl: '',
        },
        {
          id: '5',
          title: 'Education Fair 2024',
          description: 'Explore educational opportunities and connect with institutions worldwide',
          venue: 'Education Center',
          category: 'EDUCATION',
          status: 'UPCOMING',
          startTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
          maxAttendees: 300,
          bannerUrl: '',
        },
        {
          id: '6',
          title: 'Cultural Heritage Festival',
          description: 'Celebrate diverse cultures with traditional performances, food, and exhibitions',
          venue: 'Cultural Center Plaza',
          category: 'CULTURAL',
          status: 'UPCOMING',
          startTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
          maxAttendees: 800,
          bannerUrl: '',
        },
      ];
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter((event) => event.status === selectedStatus);
    }

    setFilteredEvents(filtered);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Events</h1>
          <p className="text-[#64748B]">Browse and manage all events</p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'ORGANIZER') && (
          <Link
            to="/events/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Create Event
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'ALL' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-1">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Status' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
          <Calendar className="h-16 w-16 text-[#E2E8F0] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No events found</h3>
          <p className="text-[#64748B] mb-6">Try adjusting your filters or create a new event</p>
          {(user?.role === 'ADMIN' || user?.role === 'ORGANIZER') && (
            <Link
              to="/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-lg hover:border-[#EA580C] transition-all group"
              >
                {/* Event Banner */}
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  {event.bannerUrl ? (
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-[#FEF3F2] text-[#EA580C] text-xs font-medium rounded">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[#0F172A] text-lg mb-2 group-hover:text-[#EA580C] transition-colors line-clamp-1">
                    {event.title}
                  </h3>

                  <p className="text-sm text-[#64748B] mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 text-sm text-[#64748B]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#64748B]" />
                      <span>{format(new Date(event.startTime), 'MMM dd, yyyy • hh:mm a')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#64748B]" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#64748B]" />
                      <span>{event.maxAttendees} attendees</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center text-sm text-[#64748B]">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </>
      )}
    </div>
  );
}