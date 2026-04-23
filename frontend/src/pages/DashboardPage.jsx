import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock3,
  DollarSign,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { patientAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Loading from '../components/common/Loading';
import QuickActions from '../components/dashboard/QuickActions';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { canAccessRoute } from '../utils/permissions';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const appointmentTrendData = [
  { name: 'Mon', appointments: 24, completed: 20 },
  { name: 'Tue', appointments: 30, completed: 27 },
  { name: 'Wed', appointments: 28, completed: 24 },
  { name: 'Thu', appointments: 35, completed: 30 },
  { name: 'Fri', appointments: 32, completed: 28 },
  { name: 'Sat', appointments: 18, completed: 15 },
  { name: 'Sun', appointments: 14, completed: 11 },
];

const patientStatusData = [
  { name: 'Stable', value: 64, color: '#11b89a' },
  { name: 'Observation', value: 19, color: '#f8a53b' },
  { name: 'Critical', value: 9, color: '#f26b5b' },
  { name: 'Recovered', value: 8, color: '#4098ff' },
];

const departmentStatus = [
  { name: 'Cardiology', occupancy: 88, wait: '14 min' },
  { name: 'Pediatrics', occupancy: 69, wait: '9 min' },
  { name: 'Orthopedics', occupancy: 74, wait: '12 min' },
  { name: 'Neurology', occupancy: 92, wait: '18 min' },
];

const upcomingAppointments = [
  { time: '09:45 AM', patient: 'Anika Sharma', doctor: 'Dr. Patel', type: 'Follow-up' },
  { time: '11:10 AM', patient: 'Rahul Mehta', doctor: 'Dr. Lewis', type: 'Consultation' },
  { time: '01:30 PM', patient: 'Maria Davis', doctor: 'Dr. Chen', type: 'Imaging review' },
];

const careSignals = [
  { label: 'Triage turnaround', value: '11 min', note: '2 min faster than yesterday', tone: 'mint' },
  { label: 'No-show risk', value: '6%', note: 'Down after reminder campaign', tone: 'gold' },
  { label: 'Patient satisfaction', value: '4.8/5', note: 'Strong nursing feedback this week', tone: 'blue' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    activePatients: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const roleContent = useMemo(() => {
    if (user?.role === 'Admin') {
      return {
        badge: 'Smart Hospital command center',
        title: 'Keep the hospital calm, fast, and one step ahead of patient demand.',
        subtitle: 'This view pulls together scheduling pressure, patient flow, and care quality so your team can act before issues become delays.',
        primaryAction: {
          label: 'Open appointment queue',
          path: '/appointments',
        },
        secondaryAction: canAccessRoute(user?.role, '/reports')
          ? {
              label: 'View executive reports',
              path: '/reports',
            }
          : null,
        flexibleMetric: {
          label: 'Billing run-rate',
          value: '$45.2K',
          note: '+8% compared with last week',
          icon: DollarSign,
          tone: 'coral',
        },
      };
    }

    if (user?.role === 'Doctor') {
      return {
        badge: 'Doctor clinical workspace',
        title: 'Stay on top of appointments, patient history, and decision support during rounds.',
        subtitle: 'Focus on active care, upcoming visits, and prediction tools without the admin-only system controls getting in the way.',
        primaryAction: {
          label: 'Open medical records',
          path: '/records',
        },
        secondaryAction: canAccessRoute(user?.role, '/ml-predictions')
          ? {
              label: 'Run predictive insights',
              path: '/ml-predictions',
            }
          : null,
        flexibleMetric: {
          label: 'Consultation readiness',
          value: '93%',
          note: 'Charts and appointments aligned for today',
          icon: HeartPulse,
          tone: 'coral',
        },
      };
    }

    return {
      badge: 'Staff operations workspace',
      title: 'Keep front-desk flow, intake, and patient movement running smoothly all day.',
      subtitle: 'See today’s queue, staffing pressure, and patient volume in one place with the tools most relevant to daily operations.',
      primaryAction: {
        label: 'Open patient intake',
        path: '/patients',
      },
      secondaryAction: canAccessRoute(user?.role, '/medicines')
        ? {
            label: 'Open medicine lookup',
            path: '/medicines',
          }
        : null,
      flexibleMetric: {
        label: 'Desk completion',
        value: '91%',
        note: 'Registrations and queue updates processed on time',
        icon: Activity,
        tone: 'coral',
      },
    };
  }, [user?.role]);

  const statCards = [
    {
      label: 'Registered patients',
      value: stats.totalPatients,
      note: '+12% month over month',
      icon: Users,
      tone: 'blue',
    },
    {
      label: 'Appointments booked',
      value: stats.totalAppointments,
      note: `${stats.todayAppointments} scheduled for today`,
      icon: Calendar,
      tone: 'mint',
    },
    {
      label: 'Active care cases',
      value: stats.activePatients,
      note: 'Monitored across all departments',
      icon: UserCheck,
      tone: 'gold',
    },
    roleContent.flexibleMetric,
  ];

  return (
    <div className="page-stack">
      <section className="operations-hero">
        <div className="operations-hero__copy">
          <div className="shell-chip shell-chip--soft">{roleContent.badge}</div>
          <h2 className="operations-hero__title">
            {roleContent.title}
          </h2>
          <p className="operations-hero__subtitle">
            {roleContent.subtitle}
          </p>

          <div className="operations-hero__actions">
            <button
              className="primary-button"
              onClick={() => navigate(roleContent.primaryAction.path)}
              type="button"
            >
              {roleContent.primaryAction.label}
              <ArrowRight size={16} />
            </button>

            {roleContent.secondaryAction && (
              <button
                className="outline-button"
                onClick={() => navigate(roleContent.secondaryAction.path)}
                type="button"
              >
                {roleContent.secondaryAction.label}
              </button>
            )}
          </div>
        </div>

        <div className="operations-hero__panel">
          <div className="mini-stat">
            <div className="mini-stat__label">
              <ShieldCheck size={16} />
              Care readiness
            </div>
            <div className="mini-stat__value">94%</div>
            <p className="mini-stat__copy">Staffed for peak outpatient hours.</p>
          </div>

          <div className="mini-stat-grid">
            <div className="mini-stat mini-stat--compact">
              <div className="mini-stat__label">
                <HeartPulse size={15} />
                Avg. wait
              </div>
              <div className="mini-stat__value">12 min</div>
            </div>

            <div className="mini-stat mini-stat--compact">
              <div className="mini-stat__label">
                <TrendingUp size={15} />
                Throughput
              </div>
              <div className="mini-stat__value">+9.4%</div>
            </div>

            <div className="mini-stat mini-stat--compact">
              <div className="mini-stat__label">
                <AlertCircle size={15} />
                High priority
              </div>
              <div className="mini-stat__value">7 cases</div>
            </div>

            <div className="mini-stat mini-stat--compact">
              <div className="mini-stat__label">
                <Clock3 size={15} />
                Shift overlap
              </div>
              <div className="mini-stat__value">2 hrs</div>
            </div>
          </div>
        </div>
      </section>

      <section className="metric-grid">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article className={`metric-card metric-card--${card.tone}`} key={card.label}>
              <div className="metric-card__header">
                <div>
                  <div className="metric-card__label">{card.label}</div>
                  <div className="metric-card__value">{card.value}</div>
                </div>

                <div className="metric-card__icon">
                  <Icon size={22} />
                </div>
              </div>

              <p className="metric-card__note">{card.note}</p>
            </article>
          );
        })}
      </section>

      <section className="dashboard-dual-grid">
        <QuickActions />

        <article className="section-card">
          <div className="section-heading">
            <div>
              <div className="section-heading__eyebrow">Operational signals</div>
              <h3 className="section-heading__title">What needs attention now</h3>
            </div>
          </div>

          <div className="signal-list">
            {careSignals.map((signal) => (
              <div className={`signal-card signal-card--${signal.tone}`} key={signal.label}>
                <div className="signal-card__label">{signal.label}</div>
                <div className="signal-card__value">{signal.value}</div>
                <p className="signal-card__note">{signal.note}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-dual-grid">
        <article className="section-card">
          <div className="section-heading">
            <div>
              <div className="section-heading__eyebrow">Demand trend</div>
              <h3 className="section-heading__title">Weekly appointment movement</h3>
            </div>
            <div className="shell-chip shell-chip--soft">Completion rate 86%</div>
          </div>

          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={appointmentTrendData}>
                <defs>
                  <linearGradient id="appointmentsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f7a85" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#0f7a85" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#11b89a" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#11b89a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#d8e6f0" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#5a7088', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5a7088', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    border: '1px solid #d8e6f0',
                    boxShadow: '0 18px 40px rgba(9, 30, 52, 0.12)',
                  }}
                />
                <Area type="monotone" dataKey="appointments" stroke="#0f7a85" fill="url(#appointmentsFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="completed" stroke="#11b89a" fill="url(#completedFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="section-card">
          <div className="section-heading">
            <div>
              <div className="section-heading__eyebrow">Patient state</div>
              <h3 className="section-heading__title">Current status distribution</h3>
            </div>
          </div>

          <div className="chart-frame chart-frame--split">
            <div className="chart-frame__chart">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={patientStatusData}
                    dataKey="value"
                    innerRadius={68}
                    outerRadius={104}
                    paddingAngle={4}
                  >
                    {patientStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 18,
                      border: '1px solid #d8e6f0',
                      boxShadow: '0 18px 40px rgba(9, 30, 52, 0.12)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="legend-list">
              {patientStatusData.map((status) => (
                <div className="legend-row" key={status.name}>
                  <span className="legend-row__swatch" style={{ backgroundColor: status.color }} />
                  <div className="legend-row__copy">
                    <span>{status.name}</span>
                    <strong>{status.value}%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <ActivityFeed limit={6} />

        <div className="stacked-cards">
          <article className="section-card">
            <div className="section-heading">
              <div>
                <div className="section-heading__eyebrow">Schedule pressure</div>
                <h3 className="section-heading__title">Upcoming appointments</h3>
              </div>
            </div>

            <div className="appointment-list">
              {upcomingAppointments.map((appointment) => (
                <div className="appointment-row" key={`${appointment.time}-${appointment.patient}`}>
                  <div>
                    <div className="appointment-row__patient">{appointment.patient}</div>
                    <div className="appointment-row__meta">
                      {appointment.doctor} - {appointment.type}
                    </div>
                  </div>

                  <div className="appointment-row__time">{appointment.time}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="section-card">
            <div className="section-heading">
              <div>
                <div className="section-heading__eyebrow">Capacity watch</div>
                <h3 className="section-heading__title">Department occupancy</h3>
              </div>
            </div>

            <div className="department-list">
              {departmentStatus.map((department) => (
                <div className="department-row" key={department.name}>
                  <div className="department-row__header">
                    <div>
                      <div className="department-row__name">{department.name}</div>
                      <div className="department-row__meta">Average wait {department.wait}</div>
                    </div>
                    <strong>{department.occupancy}%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-track__fill"
                      style={{ width: `${department.occupancy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
