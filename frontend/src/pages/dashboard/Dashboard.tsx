import { SetStateAction, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Ticket, Bell, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { dashboardAPI, eventsAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalTickets: number;
  totalNotifications: number;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalTickets: 0,
    totalNotifications: 0,
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'ADMIN') {
        const response = await dashboardAPI.getAdminStats();
        setStats(response.data);
      } else {
        // For regular users, we can fetch their specific stats if needed
        const response = await dashboardAPI.getUserStats(user?.id || '');
        setStats(response.data);
      }
      
      const eventsResponse = await eventsAPI.getAll();
      setRecentEvents(eventsResponse.data.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch dashboard data');
      // Demo mode - use mock data
      setStats({
        totalUsers: 0,
        totalEvents: 0,
        totalTickets: 0,
        totalNotifications: 0,
      });
      
      // Mock events for demo
      const mockEvents: SetStateAction<any[]> = [];
      setRecentEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      visible: user?.role === 'ADMIN',
    },
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-[#EA580C]',
      visible: true,
    },
    {
      title: 'Total Bookings',
      value: stats.totalTickets,
      icon: Ticket,
      color: 'bg-green-500',
      visible: true,
    },
    {
      title: 'Notifications',
      value: stats.totalNotifications,
      icon: Bell,
      color: 'bg-purple-500',
      visible: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-[#64748B]">Here's what's happening with your events today.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.filter(card => card.visible).map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex items-center justify-center h-12 w-12 ${card.color} rounded-lg mb-4`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-[#64748B] mb-1">{card.title}</p>
              <p className="text-3xl font-semibold text-[#0F172A]">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Events */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">Recent Events</h2>
            <p className="text-sm text-[#64748B] mt-1">Latest events in the system</p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#EA580C] hover:text-[#C2410C] transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-20 w-32 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-12 w-12 text-[#E2E8F0] mx-auto mb-4" />
            <p className="text-[#64748B] mb-4">No events available yet</p>
            <Link
              to="/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors"
            >
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="flex gap-4 p-6 hover:bg-[#F8FAFC] transition-colors group"
              >
                <div className="h-20 w-28 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {event.bannerUrl ? (
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-white opacity-50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#0F172A] mb-1 group-hover:text-[#EA580C] transition-colors truncate">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#64748B] mb-2 line-clamp-1">{event.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(event.startTime), 'MMM dd, yyyy')}
                    </span>
                    <span className="px-2 py-1 bg-[#FEF3F2] text-[#EA580C] rounded-full font-medium">
                      {event.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/events/create"
          className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:shadow-md hover:border-[#EA580C] transition-all group"
        >
          <div className="h-12 w-12 bg-[#FEF3F2] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#EA580C] transition-colors">
            <Calendar className="h-6 w-6 text-[#EA580C] group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-semibold text-[#0F172A] mb-2">Create Event</h3>
          <p className="text-sm text-[#64748B]">Start organizing your next event</p>
        </Link>

        <Link
          to="/bookings"
          className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:shadow-md hover:border-[#EA580C] transition-all group"
        >
          <div className="h-12 w-12 bg-[#F0FDF4] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#16A34A] transition-colors">
            <Ticket className="h-6 w-6 text-[#16A34A] group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-semibold text-[#0F172A] mb-2">My Bookings</h3>
          <p className="text-sm text-[#64748B]">View your upcoming tickets</p>
        </Link>

        <Link
          to="/analytics"
          className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:shadow-md hover:border-[#EA580C] transition-all group"
        >
          <div className="h-12 w-12 bg-[#EFF6FF] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#3B82F6] transition-colors">
            <TrendingUp className="h-6 w-6 text-[#3B82F6] group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-semibold text-[#0F172A] mb-2">View Analytics</h3>
          <p className="text-sm text-[#64748B]">Check your event performance</p>
        </Link>
      </div>
    </div>
  );
}