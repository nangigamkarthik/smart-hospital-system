import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, Star } from 'lucide-react';
import { doctorAPI } from '../services/api';
import Loading from '../components/common/Loading';
import AddDoctorModal from '../components/doctors/AddDoctorModal';
import toast from 'react-hot-toast';

const statusColors = {
  Active:    { bg: '#d1fae5', color: '#065f46' },
  'On Leave':{ bg: '#fef3c7', color: '#92400e' },
  Inactive:  { bg: '#f3f4f6', color: '#374151' },
};

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => { fetchDoctors(); fetchSpecializations(); }, [currentPage, search, filterStatus, filterSpec]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await doctorAPI.getAll({ page: currentPage, per_page: 10, specialization: filterSpec, status: filterStatus });
      setDoctors(res.data.doctors);
      setTotalPages(res.data.pages);
    } catch { toast.error('Failed to load doctors'); }
    finally { setLoading(false); }
  };

  const fetchSpecializations = async () => {
    try {
      const res = await doctorAPI.getSpecializations();
      setSpecializations(res.data.specializations);
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    try { await doctorAPI.delete(id); toast.success('Deleted'); fetchDoctors(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading && doctors.length === 0) return <Loading fullScreen />;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>Doctors</h1>
          <p style={s.sub}>Manage doctor profiles and schedules</p>
        </div>
        <button style={s.btnPrimary} onClick={() => { setEditingDoctor(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add Doctor
        </button>
      </div>

      {/* Filters */}
      <div style={s.card}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search doctors..." value={search}
              onChange={e => setSearch(e.target.value)} style={{ ...s.input, paddingLeft: '2.5rem' }} />
          </div>
          <select value={filterSpec} onChange={e => { setFilterSpec(e.target.value); setCurrentPage(1); }} style={s.input}>
            <option value="">All Specializations</option>
            {specializations.map(sp => <option key={sp} value={sp}>{sp}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} style={s.input}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={s.grid}>
        {doctors.map(doc => {
          const sc = statusColors[doc.status] || statusColors.Inactive;
          return (
            <div key={doc.id} style={s.docCard}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={s.avatar}>
                    {doc.first_name?.[0]}{doc.last_name?.[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{doc.full_name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '2px 0 0' }}>{doc.specialization}</p>
                  </div>
                </div>
                <span style={{ ...s.badge, background: sc.bg, color: sc.color }}>{doc.status}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {[
                  ['Experience', `${doc.experience_years} years`],
                  ['Consultation Fee', `₹${doc.consultation_fee}`],
                  ['Patients Treated', doc.total_patients_treated],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#6b7280' }}>{label}</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#6b7280' }}>Rating</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, color: '#111827' }}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    {doc.rating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{doc.phone}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={s.actionIcon} onClick={() => { setEditingDoctor(doc); setIsModalOpen(true); }}><Edit size={16} color="#10b981" /></button>
                  <button style={s.actionIcon} onClick={() => handleDelete(doc.id)}><Trash2 size={16} color="#ef4444" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div style={{ ...s.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Page <b>{currentPage}</b> of <b>{totalPages}</b></span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={s.btnSecondary} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
            <button style={s.btnSecondary} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        </div>
      )}

      {doctors.length === 0 && !loading && (
        <div style={{ ...s.card, textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#9ca3af' }}>No doctors found</p>
        </div>
      )}

      <AddDoctorModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingDoctor(null); }}
        onSuccess={editingDoctor ? async d => { await doctorAPI.update(editingDoctor.id, d); fetchDoctors(); } : async d => { await doctorAPI.create(d); fetchDoctors(); }}
        editDoctor={editingDoctor} />
    </div>
  );
};

const s = {
  page: { padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  h1: { fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: 0 },
  sub: { fontSize: '0.875rem', color: '#6b7280', marginTop: 4 },
  card: { background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' },
  docCard: { background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', transition: 'all 0.25s ease' },
  avatar: { width: 46, height: 46, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)', color: 'white', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' },
  btnPrimary: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)', color: 'white', fontWeight: 700, fontSize: '0.875rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(20,184,166,0.35)' },
  btnSecondary: { padding: '0.5rem 1rem', background: 'white', color: '#374151', fontWeight: 600, fontSize: '0.875rem', borderRadius: '0.625rem', border: '1.5px solid #e5e7eb', cursor: 'pointer' },
  input: { padding: '0.75rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '0.625rem', fontSize: '0.875rem', outline: 'none', background: 'white', color: '#111827' },
  actionIcon: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', borderRadius: '0.375rem' },
};

export default DoctorsPage;
