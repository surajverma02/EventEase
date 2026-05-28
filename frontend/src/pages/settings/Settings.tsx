import { useState } from 'react';
import { User, Lock, Bell, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import * as Tabs from '@radix-ui/react-tabs';
import { userProfileAPI } from '../../services/api';

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    bookingUpdates: true,
    marketingEmails: false,
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Updating user profile (simulate API call)
      const response =  await userProfileAPI.updateProfile(profileData);
      const updatedProfile = response.data.data;
      // console.log('Profile updated:', updatedProfile);
      updateUser({ ...user!, fullName: updatedProfile.fullName, email: updatedProfile.email, phone: updatedProfile.phone, bio: updatedProfile.bio });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSaving(true);
    
    try {
      // Updating user password (simulate API call)
      const response = await userProfileAPI.changePassword(passwordData);
      if(response.status === 200) {
        toast.success('Password updated successfully');
      } else {
        throw new Error('Failed to update password');
      }
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Settings</h1>
        <p className="text-[#64748B]">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex gap-4 border-b border-[#E2E8F0]">
          <Tabs.Trigger
            value="profile"
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'profile'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </Tabs.Trigger>
          <Tabs.Trigger
            value="password"
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'password'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Lock className="h-4 w-4" />
            Password
          </Tabs.Trigger>
          {/* <Tabs.Trigger
            value="notifications"
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'notifications'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Bell className="h-4 w-4" />
            Notifications
          </Tabs.Trigger> */}
        </Tabs.List>

        {/* Profile Tab */}
        <Tabs.Content value="profile">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 mt-6">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Profile Information</h3>
                <p className="text-sm text-[#64748B] mb-6">Update your account profile details</p>
              </div>

              {/* Profile Picture */}
              {/* <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-[#EA580C] flex items-center justify-center text-white text-2xl font-semibold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-[#EA580C] border border-[#EA580C] rounded-lg hover:bg-[#FEF3F2] transition-colors font-medium"
                  >
                    Change Photo
                  </button>
                  <p className="text-xs text-[#64748B] mt-2">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Tabs.Content>

        {/* Password Tab */}
        <Tabs.Content value="password">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 mt-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Change Password</h3>
                <p className="text-sm text-[#64748B] mb-6">Update your password to keep your account secure</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Tabs.Content>

        {/* Notifications Tab */}
        <Tabs.Content value="notifications">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 mt-6">
            <form onSubmit={handleNotificationsSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Notification Preferences</h3>
                <p className="text-sm text-[#64748B] mb-6">Manage how you receive notifications</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                  { key: 'eventReminders', label: 'Event Reminders', desc: 'Get reminders about upcoming events' },
                  { key: 'bookingUpdates', label: 'Booking Updates', desc: 'Updates about your bookings' },
                  { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional content and offers' },
                ].map((pref) => (
                  <div key={pref.key} className="flex items-start justify-between py-4 border-b border-[#E2E8F0] last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-[#0F172A] mb-1">{pref.label}</p>
                      <p className="text-sm text-[#64748B]">{pref.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={notificationPrefs[pref.key as keyof typeof notificationPrefs]}
                        onChange={(e) => setNotificationPrefs({ ...notificationPrefs, [pref.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#E2E8F0] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#EA580C] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E2E8F0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EA580C]"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
