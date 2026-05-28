import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Ticket } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { dashboardAPI, eventsAPI, ticketsAPI } from '../../services/api';

const COLOR_MAP: { [key: string]: string } = {
  'Technology': '#EA580C',
  'Music': '#16A34A',
  'Sports': '#3B82F6',
  'Education': '#D97706',
  'Other': '#D97706',
};

export default function Analytics() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    activeUsers: 0,
    attendanceRate: 0,
  });
  const [eventData, setEventData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch admin stats
      const statsResponse = await dashboardAPI.getAdminStats();
      const adminStats = statsResponse.data;

      // Fetch all events for trend and category data
      const eventsResponse = await eventsAPI.getAll();
      const events = eventsResponse.data || [];

      const maxBookings = events.reduce((max: number, event: { maxAttendees: any; }) => Math.max(max, event.maxAttendees || 0), 0);

      setStats({
        totalEvents: adminStats.totalEvents || 0,
        totalBookings: adminStats.totalTickets || 0,
        activeUsers: adminStats.totalUsers || 0,
        attendanceRate: Math.round((adminStats.totalTickets / maxBookings) * 100 ) || 0,
      });

      // Process event data for trend chart (monthly aggregation)
      const monthlyData = processMonthlyData(events);
      setEventData(monthlyData);

      // Process category distribution
      const categories = processCategoryData(events);
      setCategoryData(categories);

      // Get top performing events
      const top = getTopEvents(events, 3);
      setTopEvents(top);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
      // Fallback to empty/default data
      setEventData([]);
      setCategoryData([]);
      setTopEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (events: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const lastSixMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);

    const monthlyAggregation: { [key: string]: { events: number; bookings: number } } = {};

    lastSixMonths.forEach((month) => {
      monthlyAggregation[month] = { events: 0, bookings: 0 };
    });

    events.forEach((event: any) => {
      const eventMonth = event.createdAt ? new Date(event.createdAt).toLocaleString('default', { month: 'short' }) : 'Jan';
      if (monthlyAggregation[eventMonth]) {
        monthlyAggregation[eventMonth].events += 1;
        monthlyAggregation[eventMonth].bookings += event.bookingsCount || 0;
      }
    });

    return lastSixMonths.map((month) => ({
      month,
      events: monthlyAggregation[month].events,
      bookings: monthlyAggregation[month].bookings,
    }));
  };

  const processCategoryData = (events: any[]) => {
    const categoryCount: { [key: string]: number } = {};
    let total = 0;

    events.forEach((event: any) => {
      const category = event.category || 'Other';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      total += 1;
    });

    return Object.entries(categoryCount).map(([name, count]) => ({
      name,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      color: COLOR_MAP[name] || '#8B5CF6',
    }));
  };

  const getTopEvents = (events: any[], limit: number) => {
    console.log('All events for top events calculation:', events);
    return events
      .sort((a: any, b: any) => (b.registeredAttendees || 0) - (a.registeredAttendees || 0))
      .slice(0, limit)
      .map((event: any) => ({
        id: event.id,
        name: event.title || event.name,
        category: event.category || 'Other',
        bookings: event.registeredAttendees || 0,
        maxAttendees: event.maxAttendees || 0,
        rate: Math.round((event.registeredAttendees / event.maxAttendees) * 100) || 0,
      }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Analytics</h1>
        <p className="text-[#64748B]">Track your event performance and insights</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-[#64748B]">Loading analytics data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                {/* <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +12.5%
                </span> */}
              </div>
              <p className="text-sm text-[#64748B] mb-1">Total Events</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{stats.totalEvents}</p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-green-600" />
                </div>
                {/* <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +18.2%
                </span> */}
              </div>
              <p className="text-sm text-[#64748B] mb-1">Total Bookings</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{stats.totalBookings}</p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                {/* <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +8.1%
                </span> */}
              </div>
              <p className="text-sm text-[#64748B] mb-1">Active Users</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{stats.activeUsers}</p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#EA580C]" />
                </div>
                {/* <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +25.3%
                </span> */}
              </div>
              <p className="text-sm text-[#64748B] mb-1">Attendance Rate</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{stats.attendanceRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Top Events */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <div className="p-6 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Top Performing Events</h3>
              <p className="text-sm text-[#64748B]">Events with highest attendance</p>
            </div>
            <div className="overflow-x-auto">
              {topEvents.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                        Bookings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                        Attendance Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {topEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-[#0F172A]">{event.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-[#FEF3F2] text-[#EA580C] text-xs font-medium rounded-full">
                            {event.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{event.bookings}{event.maxAttendees > 0 ? ` / ${event.maxAttendees}` : ''}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden max-w-[100px]">
                              <div 
                                className="h-full bg-[#16A34A] rounded-full" 
                                style={{ width: `${event.rate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-[#64748B]">{event.rate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-[#64748B]">
                  No events available yet
                </div>
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events & Bookings Trend */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Events & Bookings Trend</h3>
                <p className="text-sm text-[#64748B]">Last 6 months overview</p>
              </div>
              {eventData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Bar dataKey="events" fill="#EA580C" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="bookings" fill="#16A34A" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-[#64748B]">
                  No data available
                </div>
              )}
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Event Categories</h3>
                <p className="text-sm text-[#64748B]">Distribution by category</p>
              </div>
              {categoryData.length > 0 ? (
                <>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {categoryData.map((category) => (
                      <div key={category.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span className="text-sm text-[#64748B]">{category.name} ({category.value}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-72 flex items-center justify-center text-[#64748B]">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Growth Chart */}
          {/* <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-1">User Growth</h3>
              <p className="text-sm text-[#64748B]">Monthly user registration trend</p>
            </div>
            {eventData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eventData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#EA580C" 
                    strokeWidth={3}
                    dot={{ fill: '#EA580C', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-[#64748B]">
                No data available
              </div>
            )}
          </div> */}
        </>
      )}
    </div>
  );
}
