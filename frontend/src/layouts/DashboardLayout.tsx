import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Tag, 
  Ticket, 
  Bell, 
  Users, 
  BarChart3, 
  Settings,
  Search,
  ChevronDown,
  LogOut,
  User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import { notificationsAPI } from '../services/api';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Bookings', href: '/bookings', icon: Ticket },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Users', href: '/users', icon: Users, adminOnly: true },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, adminOnly: true },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, setNotifications, markAsRead } = useNotificationStore();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  };

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || user?.role === 'ADMIN'
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#374151]">
          <Calendar className="h-6 w-6 text-[#EA580C]" />
          <span className="ml-3 text-lg font-semibold text-white">EventEase</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-[#EA580C] text-white'
                      : 'text-[#CBD5E1] hover:bg-[#1F2937] hover:text-white'
                  }
                `}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#374151]">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-[#EA580C] flex items-center justify-center text-white font-semibold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-[#9CA3AF] truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search events, bookings..."
                className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Popover.Root open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <Popover.Trigger asChild>
                <button className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-[#EA580C] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="w-80 bg-white rounded-lg shadow-lg border border-[#E2E8F0] z-50"
                  align="end"
                  sideOffset={8}
                >
                  <div className="p-4 border-b border-[#E2E8F0]">
                    <h3 className="font-semibold text-[#0F172A]">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-[#64748B] text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleMarkAsRead(notification.id)}
                          className={`p-4 border-b border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors ${
                            !notification.read ? 'bg-[#FEF3F2]' : ''
                          }`}
                        >
                          <p className="text-sm text-[#0F172A] mb-1">{notification.message}</p>
                          <p className="text-xs text-[#64748B]">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-[#E2E8F0]">
                    <Link
                      to="/notifications"
                      className="block text-center text-sm text-[#EA580C] hover:text-[#C2410C] font-medium"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* User Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#F8FAFC] rounded-lg transition-colors">
                  <div className="h-8 w-8 rounded-full bg-[#EA580C] flex items-center justify-center text-white text-sm font-semibold">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-4 w-4 text-[#64748B]" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-48 bg-white rounded-lg shadow-lg border border-[#E2E8F0] p-1 z-50"
                  align="end"
                  sideOffset={8}
                >
                  <div className="px-3 py-2 border-b border-[#E2E8F0]">
                    <p className="text-sm font-medium text-[#0F172A]">{user?.fullName}</p>
                    <p className="text-xs text-[#64748B]">{user?.email}</p>
                  </div>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#0F172A] hover:bg-[#F8FAFC] rounded cursor-pointer outline-none"
                    onSelect={() => navigate('/settings')}
                  >
                    <User className="h-4 w-4" />
                    Profile Settings
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-[#E2E8F0] my-1" />
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] rounded cursor-pointer outline-none"
                    onSelect={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
