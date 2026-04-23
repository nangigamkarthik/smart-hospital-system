import React, { useState, useEffect } from 'react';
import { Building2, Bed, Phone, Mail, Plus, Edit, Trash2 } from 'lucide-react';
import { departmentAPI } from '../services/api';
import Loading from '../components/common/Loading';
import AddDepartmentModal from '../components/departments/AddDepartmentModal';
import toast from 'react-hot-toast';

const statusStyle = {
  Active:             { bg: '#d1fae5', color: '#065f46' },
  Inactive:           { bg: '#f3f4f6', color: '#374151' },
  'Under Maintenance':{ bg: '#fef3c7', color: '#92400e' },
};

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentAPI.getAll();
      setDepartments(res.data.departments || res.data);
    } catch { toast.error('Failed to load departments'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try { await departmentAPI.delete(id); toast.success('Deleted'); fetchDepartments(); }
    catch { toast.error('Failed to delete'); }
  };

  const calcOccupancy = d => d.total_beds === 0 ? 0 : (((d.total_beds - d.available_beds) / d.total_beds) * 100).toFixed(1);

  const occupancyColor = rate => rate >= 90 ? '#ef4444' : rate >= 70 ? '#f59e0b' : '#10b981';

  const totals = {
    depts: departments.length,
    beds: departments.reduce((a, d) => a + (d.total_beds || 0), 0),
    occupied: departments.reduce((a, d) => a + ((d.total_beds || 0) - (d.available_beds || 0)), 0),
    available: departments.reduce((a, d) => a + (d.available_beds || 0), 0),
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>Departments</h1>
          <p style={s.sub}>Hospital departments and bed management</p>
        </div>
        <button style={s.btnPrimary} onClick={() => { setEditingDepartment(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1.25rem' }}>
        {[
          { label: 'Total Departments', val: totals.depts,    border: '#3b82f6', bg: '#eff6ff' },
          { label: 'Total Beds',        val: totals.beds,     border: '#10b981', bg: '#f0fdf4' },
          { label: 'Occupied Beds',     val: totals.occupied, border: '#f59e0b', bg: '#fffbeb' },
          { label: 'Available Beds',    val: totals.available,border: '#8b5cf6', bg: '#f5f3ff' },
        ].map(({ label, val, border, bg }) => (
          <div key={label} style={{ ...s.card, background: bg, borderLeft: `4px solid ${border}`, padding: '1.25rem' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6b7280', margin: '0 0 6px', textTransform: 'uppercase' }}>{label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
        {departments.map(dept => {
          const occ = calcOccupancy(dept);
          const occColor = occupancyColor(parseFloat(occ));
          const ss = statusStyle[dept.status] || statusStyle.Inactive;
          return (
            <div key={dept.id} style={s.deptCard}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={s.iconCircle}><Building2 size={22} color="white" /></div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{dept.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '2px 0 0' }}>Code: {dept.code}</p>
                  </div>
                </div>
                <span style={{ ...s.badge, background: ss.bg, color: ss.color }}>{dept.status}</span>
              </div>

              {dept.description && (
                <p style={{ fontSize: '0.825rem', color: '#6b7280', marginBottom: '1rem', lineHeight: 1.5 }}>{dept.description}</p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {[
                  ['Total Beds', dept.total_beds || 0, <Bed size={14} />],
                  ['Occupied', (dept.total_beds || 0) - (dept.available_beds || 0), null],
                  ['Available', dept.available_beds || 0, null, '#059669'],
                  ['Floor', dept.floor || 'N/A', null],
                ].map(([label, val, icon, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>{icon}{label}</span>
                    <span style={{ fontWeight: 700, color: color || '#111827' }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Occupancy bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Occupancy Rate</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: occColor }}>{occ}%</span>
                </div>
                <div style={{ height: 8, background: '#e5e7eb', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${occ}%`, background: occColor, borderRadius: 9999, transition: 'width 0.4s' }} />
                </div>
              </div>

              {/* Contact */}
              {(dept.phone || dept.email) && (
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {dept.phone && <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={13} />{dept.phone}</span>}
                  {dept.email && <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={13} />{dept.email}</span>}
                </div>
              )}

              <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '0.875rem', paddingTop: '0.875rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button style={s.actionIcon} onClick={() => { setEditingDepartment(dept); setIsModalOpen(true); }}><Edit size={17} color="#10b981" /></button>
                <button style={s.actionIcon} onClick={() => handleDelete(dept.id)}><Trash2 size={17} color="#ef4444" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {departments.length === 0 && !loading && (
        <div style={{ ...s.card, textAlign: 'center', padding: '3rem' }}>
          <Building2 size={48} color="#d1d5db" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#9ca3af' }}>No departments found</p>
          <button style={{ ...s.btnPrimary, margin: '1rem auto 0', display: 'inline-flex' }} onClick={() => { setEditingDepartment(null); setIsModalOpen(true); }}>
            <Plus size={16} /> Add First Department
          </button>
        </div>
      )}

      <AddDepartmentModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingDepartment(null); }}
        onSuccess={editingDepartment ? async d => { await departmentAPI.update(editingDepartment.id, d); fetchDepartments(); } : async d => { await departmentAPI.create(d); fetchDepartments(); }}
        editDepartment={editingDepartment} />
    </div>
  );
};

const s = {
  page: { padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  h1: { fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: 0 },
  sub: { fontSize: '0.875rem', color: '#6b7280', marginTop: 4 },
  card: { background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' },
  deptCard: { background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', transition: 'all 0.25s ease' },
  iconCircle: { width: 44, height: 44, borderRadius: '0.75rem', background: 'linear-gradient(135deg,#14b8a6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  badge: { display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' },
  btnPrimary: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#14b8a6,#06b6d4)', color: 'white', fontWeight: 700, fontSize: '0.875rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(20,184,166,0.35)' },
  actionIcon: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', borderRadius: '0.375rem' },
};

export default DepartmentsPage;
