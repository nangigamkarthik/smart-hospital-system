import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import Loading from '../components/common/Loading';
import StatCard from '../components/common/StatCard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';

const AdvancedAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [appointmentTrends, setAppointmentTrends] = useState([]);
  const [demographics, setDemographics] = useState(null);
  const [doctorPerformance, setDoctorPerformance] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [departmentOccupancy, setDepartmentOccupancy] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const [trendsRes, demographicsRes, performanceRes, revenueRes, occupancyRes] = await Promise.all([
        analyticsAPI.getAppointmentTrends(90),
        analyticsAPI.getPatientDemographics(),
        analyticsAPI.getDoctorPerformance(),
        analyticsAPI.getRevenue(),
        analyticsAPI.getDepartmentOccupancy(),
      ]);

      setAppointmentTrends(trendsRes.data.trends);
      setDemographics(demographicsRes.data);
      setDoctorPerformance(performanceRes.data);
      setRevenue(revenueRes.data);
      setDepartmentOccupancy(occupancyRes.data.departments);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
        <p className="text-gray-600 mt-1">Comprehensive insights and trends</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${revenue?.total_revenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Avg Revenue/Month"
          value={`₹${(revenue?.total_revenue / 12)?.toLocaleString() || 0}`}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Total Patients"
          value={demographics?.gender_distribution?.reduce((acc, g) => acc + g.count, 0) || 0}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Total Appointments"
          value={appointmentTrends?.reduce((acc, day) => acc + day.count, 0) || 0}
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* Appointment Trends - 90 Days */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Appointment Trends (Last 90 Days)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={appointmentTrends}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#0ea5e9" 
              fillOpacity={1} 
              fill="url(#colorCount)" 
              name="Appointments"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Month */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Revenue (Last 12 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenue?.monthly_revenue || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  return months[value - 1];
                }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString()}`}
                labelFormatter={(value) => {
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  return months[value - 1];
                }}
              />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Blood Group Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Blood Group Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demographics?.blood_group_distribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ blood_group, count }) => `${blood_group}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {(demographics?.blood_group_distribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Doctor Performance */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Doctors by Appointments
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={doctorPerformance?.top_doctors || []} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="total_appointments" fill="#0ea5e9" name="Total Appointments" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Specialization Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Doctor Specialization Distribution
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={doctorPerformance?.specialization_distribution || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="specialization" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" name="Number of Doctors" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Department Occupancy */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Department Bed Occupancy
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={departmentOccupancy}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department_name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="occupied_beds" fill="#ef4444" name="Occupied" />
            <Bar dataKey="available_beds" fill="#10b981" name="Available" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsPage;
