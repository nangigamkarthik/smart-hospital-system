import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, Database, Mail, Shield, Save, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    full_name: 'Admin User',
    email: 'admin@hospital.com',
    phone: '+1 234 567 8900',
    department: 'Administration',
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    email_appointments: true,
    email_patients: true,
    email_reports: false,
    push_appointments: true,
    push_emergencies: true,
    sms_reminders: false,
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    appointment_duration: '30',
    working_hours_start: '09:00',
    working_hours_end: '18:00',
    max_appointments_per_day: '50',
    auto_backup: true,
    maintenance_mode: false,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match!');
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }

    try {
      await authAPI.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      toast.success('Password changed successfully!');
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    }
  };

  const handleNotificationUpdate = () => {
    toast.success('Notification preferences saved!');
  };

  const handleSystemUpdate = () => {
    toast.success('System settings updated!');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'system', name: 'System', icon: Database },
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center">
          <SettingsIcon className="h-10 w-10 mr-4" />
          <div>
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-indigo-100 text-lg">Manage your account and system preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 mr-2 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    AU
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{profileData.full_name}</h3>
                    <p className="text-gray-600">{profileData.email}</p>
                    <button type="button" className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
                      Change Profile Picture
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Lock className="h-6 w-6 mr-2 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-400 mb-6">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-yellow-900">Password Security</h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        Use a strong password with at least 6 characters, including numbers and special characters.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={passwordData.old_password}
                      onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                      className="input-field pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="input-field pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Change Password</span>
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <button className="btn-secondary">Enable 2FA</button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Bell className="h-6 w-6 mr-2 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
              </div>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'email_appointments', label: 'Appointment Updates' },
                      { key: 'email_patients', label: 'New Patient Registrations' },
                      { key: 'email_reports', label: 'Daily Reports' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-purple-600" />
                    Push Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'push_appointments', label: 'Upcoming Appointments' },
                      { key: 'push_emergencies', label: 'Emergency Alerts' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-green-600" />
                    SMS Notifications
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium text-gray-700">Appointment Reminders</span>
                      <input
                        type="checkbox"
                        checked={notifications.sms_reminders}
                        onChange={(e) => setNotifications({ ...notifications, sms_reminders: e.target.checked })}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleNotificationUpdate} className="btn-primary flex items-center space-x-2">
                    <Save className="h-5 w-5" />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Database className="h-6 w-6 mr-2 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-l-4 border-orange-400 mb-6">
                  <p className="text-sm text-orange-800">
                    <strong>Note:</strong> These settings affect the entire system. Changes may require administrator privileges.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Appointment Duration (minutes)
                    </label>
                    <select
                      value={systemSettings.appointment_duration}
                      onChange={(e) => setSystemSettings({ ...systemSettings, appointment_duration: e.target.value })}
                      className="input-field"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Appointments Per Day
                    </label>
                    <input
                      type="number"
                      value={systemSettings.max_appointments_per_day}
                      onChange={(e) => setSystemSettings({ ...systemSettings, max_appointments_per_day: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Working Hours Start
                    </label>
                    <input
                      type="time"
                      value={systemSettings.working_hours_start}
                      onChange={(e) => setSystemSettings({ ...systemSettings, working_hours_start: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Working Hours End
                    </label>
                    <input
                      type="time"
                      value={systemSettings.working_hours_end}
                      onChange={(e) => setSystemSettings({ ...systemSettings, working_hours_end: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Automatic Backup</span>
                      <p className="text-sm text-gray-600">Enable daily automatic database backups</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.auto_backup}
                      onChange={(e) => setSystemSettings({ ...systemSettings, auto_backup: e.target.checked })}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Maintenance Mode</span>
                      <p className="text-sm text-gray-600">Disable for regular users</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenance_mode}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maintenance_mode: e.target.checked })}
                      className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                  </label>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSystemUpdate} className="btn-primary flex items-center space-x-2">
                    <Save className="h-5 w-5" />
                    <span>Save Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
