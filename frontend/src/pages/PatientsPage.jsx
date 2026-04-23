import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { patientAPI } from '../services/api';
import Loading from '../components/common/Loading';
import AddPatientModal from '../components/patients/AddPatientModal';
import ViewPatientModal from '../components/patients/ViewPatientModal';
import toast from 'react-hot-toast';

const statusColors = {
  Active:   { bg: '#d1fae5', color: '#065f46' },
  Inactive: { bg: '#f3f4f6', color: '#374151' },
  Deceased: { bg: '#fee2e2', color: '#991b1b' },
};

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);

  useEffect(() => { fetchPatients(); }, [currentPage, search, filterStatus]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAll({ page: currentPage, per_page: 10, search, status: filterStatus });
      setPatients(response.data.patients);
      setTotalPages(response.data.pages);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    try {
      await patientAPI.delete(id);
      toast.success('Patient deleted');
      fetchPatients();
    } catch { toast.error('Failed to delete patient'); }
  };

  if (loading && patients.length === 0) return <Loading fullScreen />;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>Patients</h1>
          <p style={s.sub}>Manage patient records and information</p>
        </div>
        <button style={s.btnPrimary} onClick={() => { setEditingPatient(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add Patient
        </button>
      </div>

      {/* Filters */}
      <div style={s.card}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text" placeholder="Search by name, ID, phone..." value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{ ...s.input, paddingLeft: '2.5rem' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={16} color="#9ca3af" />
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} style={s.input}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)' }}>
                {['Patient ID','Name','Gender','Blood Group','Phone','Status','Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? 'white' : '#f9fafb' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f0fdfa'}
                  onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#f9fafb'}
                >
                  <td style={s.td}><span style={s.pid}>{p.patient_id}</span></td>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{p.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.email}</div>
                  </td>
                  <td style={s.td}><span style={{ fontSize: '0.875rem', color: '#374151' }}>{p.gender}</span></td>
                  <td style={s.td}><span style={{ fontSize: '0.875rem', color: '#374151' }}>{p.blood_group || 'N/A'}</span></td>
                  <td style={s.td}><span style={{ fontSize: '0.875rem', color: '#374151' }}>{p.phone}</span></td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: statusColors[p.status]?.bg || '#f3f4f6', color: statusColors[p.status]?.color || '#374151' }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={s.actionIcon} title="View" onClick={() => { setViewingPatient(p); setIsViewModalOpen(true); }}><Eye size={17} color="#0891b2" /></button>
                      <button style={s.actionIcon} title="Edit" onClick={() => { setEditingPatient(p); setIsModalOpen(true); }}><Edit size={17} color="#10b981" /></button>
                      <button style={s.actionIcon} title="Delete" onClick={() => handleDelete(p.id)}><Trash2 size={17} color="#ef4444" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Page <b>{currentPage}</b> of <b>{totalPages}</b></span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={s.btnSecondary} disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
            <button style={s.btnSecondary} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>
      </div>

      {patients.length === 0 && !loading && (
        <div style={{ ...s.card, textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#9ca3af', fontSize: '1rem' }}>No patients found</p>
        </div>
      )}

      <AddPatientModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingPatient(null); }}
        onSuccess={editingPatient ? async d => { await patientAPI.update(editingPatient.id, d); fetchPatients(); } : async d => { await patientAPI.create(d); fetchPatients(); }}
        editPatient={editingPatient} />
      <ViewPatientModal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); setViewingPatient(null); }} patient={viewingPatient} />
    </div>
  );
};

const s = {
  page: { padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  h1: { fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: 0 },
  sub: { fontSize: '0.875rem', color: '#6b7280', marginTop: 4 },
  card: { background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' },
  btnPrimary: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)', color: 'white', fontWeight: 700, fontSize: '0.875rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(20,184,166,0.35)' },
  btnSecondary: { padding: '0.5rem 1rem', background: 'white', color: '#374151', fontWeight: 600, fontSize: '0.875rem', borderRadius: '0.625rem', border: '1.5px solid #e5e7eb', cursor: 'pointer' },
  input: { padding: '0.75rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '0.625rem', fontSize: '0.875rem', outline: 'none', width: '100%', background: 'white', color: '#111827' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '0.875rem 1.25rem', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' },
  badge: { display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 },
  pid: { fontSize: '0.8rem', fontWeight: 700, color: '#0891b2', background: '#e0f2fe', padding: '0.2rem 0.5rem', borderRadius: '0.375rem' },
  actionIcon: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: '0.375rem' },
};

export default PatientsPage;
