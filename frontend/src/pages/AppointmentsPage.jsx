import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User, Stethoscope, Plus, Filter } from 'lucide-react';
import { appointmentAPI } from '../services/api';
import Loading from '../components/common/Loading';
import AddAppointmentModal from '../components/appointments/AddAppointmentModal';
import toast from 'react-hot-toast';

const statusStyle = {
  Scheduled:   { bg: '#dbeafe', color: '#1d4ed8' },
  Confirmed:   { bg: '#d1fae5', color: '#065f46' },
  'In Progress':{ bg: '#fef3c7', color: '#92400e' },
  Completed:   { bg: '#ede9fe', color: '#5b21b6' },
  Cancelled:   { bg: '#fee2e2', color: '#991b1b' },
  'No Show':   { bg: '#f3f4f6', color: '#374151' },
};

const StatBox = ({ label, value, icon: Icon, grad }) => (
  <div style={{ background: grad, borderRadius: '1rem', padding: '1.25rem 1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
    <div>
      <p style={{ fontSize: '0.8rem', opacity: 0.85, margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{value}</p>
    </div>
    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem', padding: '0.75rem' }}>
      <Icon size={24} color="white" />
    </div>
  </div>
);

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, scheduled: 0, completed: 0, cancelled: 0 });
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => { fetchData(); }, [currentPage, filterDate, filterStatus]);

  const fetchData = async () => {
    await Promise.all([fetchAppointments(), fetchStats()]);
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentAPI.getAll({ page: currentPage, per_page: 10, date: filterDate, status: filterStatus });
      setAppointments(res.data.appointments);
      setTotalPages(res.data.pages);
    } catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try { const res = await appointmentAPI.getStats(); setStats(res.data); } catch {}
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await appointmentAPI.updateStatus(id, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch { toast.error('Failed to update'); }
  };

  const formatDate = d => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  const formatTime = t => t ? new Date(`2000-01-01T${t}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A';

  if (loading && appointments.length === 0) return <Loading fullScreen />;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>Appointments</h1>
          <p style={s.sub}>Manage and track patient appointments</p>
        </div>
        <button style={s.btnPrimary} onClick={() => { setEditingAppointment(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Book Appointment
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '1.25rem' }}>
        <StatBox label="Total Appointments" value={stats.total} icon={Calendar} grad="linear-gradient(135deg,#3b82f6,#06b6d4)" />
        <StatBox label="Scheduled" value={stats.scheduled} icon={Clock} grad="linear-gradient(135deg,#10b981,#059669)" />
        <StatBox label="Completed" value={stats.completed} icon={CheckCircle} grad="linear-gradient(135deg,#8b5cf6,#7c3aed)" />
        <StatBox label="Cancelled" value={stats.cancelled} icon={XCircle} grad="linear-gradient(135deg,#ef4444,#dc2626)" />
      </div>

      {/* Filters */}
      <div style={s.card}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={s.label}>Filter by Date</label>
            <input type="date" value={filterDate} onChange={e => { setFilterDate(e.target.value); setCurrentPage(1); }} style={s.input} />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={s.label}>Filter by Status</label>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} style={s.input}>
              <option value="">All Status</option>
              {Object.keys(statusStyle).map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {appointments.map(apt => {
          const ss = statusStyle[apt.status] || statusStyle['No Show'];
          return (
            <div key={apt.id} style={s.aptCard}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={s.avatar}>{apt.patient_name?.charAt(0) || 'P'}</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={15} color="#6b7280" />{apt.patient_name || 'Unknown Patient'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Stethoscope size={13} />{apt.doctor_name || 'Unknown Doctor'}
                    </p>
                  </div>
                </div>
                <span style={{ ...s.badge, background: ss.bg, color: ss.color }}>{apt.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0.75rem', marginBottom: '0.875rem' }}>
                {[
                  { label: 'Date', value: formatDate(apt.appointment_date), icon: <Calendar size={14} color="#6b7280" /> },
                  { label: 'Time', value: formatTime(apt.appointment_time), icon: <Clock size={14} color="#6b7280" /> },
                  { label: 'Type', value: apt.appointment_type },
                  { label: 'Department', value: apt.department || 'N/A' },
                ].map(({ label, value, icon }) => (
                  <div key={label}>
                    <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>{icon}{value}</p>
                  </div>
                ))}
              </div>

              {apt.reason && (
                <div style={{ background: '#eff6ff', borderRadius: '0.625rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', margin: '0 0 3px' }}>Reason for Visit</p>
                  <p style={{ fontSize: '0.875rem', color: '#111827', margin: 0 }}>{apt.reason}</p>
                </div>
              )}

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>ID: {apt.appointment_id}</span>
                <div style={{ display: 'flex', gap: '0.625rem' }}>
                  {apt.status === 'Scheduled' && <button style={s.actionBtn('#059669')} onClick={() => handleStatusUpdate(apt.id, 'Confirmed')}>Confirm</button>}
                  {apt.status === 'Confirmed' && <button style={s.actionBtn('#2563eb')} onClick={() => handleStatusUpdate(apt.id, 'In Progress')}>Start</button>}
                  {apt.status === 'In Progress' && <button style={s.actionBtn('#7c3aed')} onClick={() => handleStatusUpdate(apt.id, 'Completed')}>Complete</button>}
                  {['Scheduled','Confirmed'].includes(apt.status) && <button style={s.actionBtn('#dc2626')} onClick={() => handleStatusUpdate(apt.id, 'Cancelled')}>Cancel</button>}
                  <button style={s.actionBtn('#4338ca')} onClick={() => { setEditingAppointment(apt); setIsModalOpen(true); }}>Edit</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {appointments.length === 0 && !loading && (
        <div style={{ ...s.card, textAlign: 'center', padding: '3rem' }}>
          <Calendar size={48} color="#d1d5db" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#9ca3af', fontWeight: 600, fontSize: '1rem', margin: 0 }}>No appointments found</p>
          <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginTop: 6 }}>
            {filterDate || filterStatus ? 'Try adjusting your filters' : 'Click "Book Appointment" to schedule one'}
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ ...s.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Page <b>{currentPage}</b> of <b>{totalPages}</b></span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={s.btnSecondary} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
            <button style={s.btnSecondary} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        </div>
      )}

      <AddAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchData} editAppointment={editingAppointment} />
    </div>
  );
};

const s = {
  page: { padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  h1: { fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: 0 },
  sub: { fontSize: '0.875rem', color: '#6b7280', marginTop: 4 },
  card: { background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' },
  aptCard: { background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', transition: 'box-shadow 0.2s' },
  avatar: { width: 44, height: 44, borderRadius: '0.75rem', background: 'linear-gradient(135deg,#14b8a6,#06b6d4)', color: 'white', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  badge: { display: 'inline-flex', padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { padding: '0.75rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '0.625rem', fontSize: '0.875rem', outline: 'none', width: '100%', background: 'white', color: '#111827' },
  btnPrimary: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#14b8a6,#06b6d4)', color: 'white', fontWeight: 700, fontSize: '0.875rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(20,184,166,0.35)' },
  btnSecondary: { padding: '0.5rem 1rem', background: 'white', color: '#374151', fontWeight: 600, fontSize: '0.875rem', borderRadius: '0.625rem', border: '1.5px solid #e5e7eb', cursor: 'pointer' },
  actionBtn: color => ({ padding: '0.375rem 0.875rem', background: 'none', border: `1.5px solid ${color}`, borderRadius: '0.5rem', color, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }),
};

export default AppointmentsPage;
