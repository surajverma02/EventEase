import { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { notificationsAPI } from '../../services/api';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function Notifications() {
  const { notifications, setNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      markAsRead(id);
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      await Promise.all(unreadIds.map(id => notificationsAPI.markAsRead(id)));
      markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationColor = (type: string, read: boolean) => {
    if (read) return 'bg-white border-[#E2E8F0]';
    
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-50 border-green-200';
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200';
      case 'ERROR':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    const baseClass = 'h-6 w-6';
    switch (type) {
      case 'SUCCESS':
        return <Check className={`${baseClass} text-green-600`} />;
      case 'WARNING':
        return <Bell className={`${baseClass} text-yellow-600`} />;
      case 'ERROR':
        return <Bell className={`${baseClass} text-red-600`} />;
      default:
        return <Bell className={`${baseClass} text-blue-600`} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Notifications</h1>
          <p className="text-[#64748B]">Stay updated with your event activities</p>
        </div>
        {notifications.filter(n => !n.read).length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors font-medium"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
          <Bell className="h-16 w-16 text-[#E2E8F0] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No notifications yet</h3>
          <p className="text-[#64748B]">When you get notifications, they'll show up here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border p-6 transition-all ${getNotificationColor(
                notification.type,
                notification.read
              )} ${!notification.read ? 'shadow-sm' : ''}`}
            >
              <div className="flex gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.read ? 'bg-gray-100' : ''
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className={`text-sm ${notification.read ? 'text-[#64748B]' : 'text-[#0F172A] font-medium'}`}>
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-[#EA580C] hover:text-[#C2410C] font-medium whitespace-nowrap"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#64748B]">
                    <span>
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                    <span className="h-1 w-1 bg-[#E2E8F0] rounded-full"></span>
                    <span className="uppercase tracking-wide">{notification.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
