import React, { useState, useEffect } from 'react';
import { Users, Calendar, FileText, TrendingUp, Activity, DollarSign, UserCheck, Clock } from 'lucide-react';
import { patientAPI, appointmentAPI } from '../services/api';
import StatCard from '../components/common/StatCard';
import Loading from '../components/common/Loading';
import QuickActions from '../components/dashboard/QuickActions';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EnhancedDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    activePatients: 0,
  });

  const [appointmentData, setAppointmentData] = useState([]);
  const [patientStatusData, setPatientStatusData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const [patientsRes, appointmentsRes] = await Promise.all([
        patientAPI.getStats(),
        appointmentAPI.getStats(),
      ]);

      setStats({
        totalPatients: patientsRes.data.total || 0,
        totalAppointments: appointmentsRes.data.total || 0,
        todayAppointments: appointmentsRes.data.scheduled || 0,
        activePatients: patientsRes.data.active || 0,
      });

      // Mock chart data
      setAppointmentData([
        { name: 'Mon', appointments: 24, completed: 20 },
        { name: 'Tue', appointments: 30, completed: 28 },
        { name: 'Wed', appointments: 28, completed: 22 },
        { name: 'Thu', appointments: 35, completed: 31 },
        { name: 'Fri', appointments: 32, completed: 29 },
        { name: 'Sat', appointments: 18, completed: 16 },
        { name: 'Sun', appointments: 12, completed: 10 },
      ]);

      setPatientStatusData([
        { name: 'Stable', value: 65, color: '#10b981' },
        { name: 'Under Treatment', value: 25, color: '#f59e0b' },
        { name: 'Critical', value: 7, color: '#ef4444' },
        { name: 'Recovered', value: 3, color: '#6366f1' },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-indigo-100 text-lg">Here's what's happening with your hospital today</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
              <div className="text-center">
                <p className="text-sm opacity-90">Today's Date</p>
                <p className="text-2xl font-bold mt-1">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs opacity-75 mt-1">{new Date().getFullYear()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Patients</p>
              <p className="text-4xl font-bold">{stats.totalPatients}</p>
              <p className="text-xs opacity-75 mt-2">↑ 12% from last month</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Appointments</p>
              <p className="text-4xl font-bold">{stats.totalAppointments}</p>
              <p className="text-xs opacity-75 mt-2">Today: {stats.todayAppointments}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <Calendar className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Active Patients</p>
              <p className="text-4xl font-bold">{stats.activePatients}</p>
              <p className="text-xs opacity-75 mt-2">Under treatment</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <UserCheck className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Revenue</p>
              <p className="text-4xl font-bold">$45.2K</p>
              <p className="text-xs opacity-75 mt-2">↑ 8% from last week</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-indigo-600" />
            Weekly Appointment Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={appointmentData}>
              <defs>
                <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="appointments" stroke="#6366f1" fillOpacity={1} fill="url(#colorAppointments)" name="Total" />
              <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-indigo-600" />
            Patient Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={patientStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {patientStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ActivityFeed limit={6} />
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-indigo-600" />
              Upcoming Today
            </h3>
            <div className="space-y-3">
              {[
                { time: '10:00 AM', patient: 'John Doe', doctor: 'Dr. Smith' },
                { time: '11:30 AM', patient: 'Sarah Williams', doctor: 'Dr. Johnson' },
                { time: '2:00 PM', patient: 'Michael Brown', doctor: 'Dr. Davis' },
              ].map((apt, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{apt.patient}</p>
                    <p className="text-xs text-gray-600">{apt.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-indigo-600">{apt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Department Status</h3>
            <div className="space-y-3">
              {[
                { name: 'Cardiology', occupancy: 85, color: 'red' },
                { name: 'Pediatrics', occupancy: 65, color: 'blue' },
                { name: 'Orthopedics', occupancy: 72, color: 'green' },
                { name: 'Neurology', occupancy: 90, color: 'purple' },
              ].map((dept, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                    <p className="text-sm font-semibold text-gray-600">{dept.occupancy}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${dept.color}-500`}
                      style={{ width: `${dept.occupancy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboardPage;
