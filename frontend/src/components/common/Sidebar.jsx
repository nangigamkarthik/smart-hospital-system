import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Brain,
  Building2,
  Calendar,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  Pill,
  Settings,
  Stethoscope,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../services/AuthContext';
import { canAccessRoute, getPortalLabelForRole } from '../../utils/permissions';

const menuSections = [
  {
    title: 'Overview',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Dashboard', hint: 'Live hospital pulse' },
    ],
  },
  {
    title: 'Care Delivery',
    items: [
      { path: '/patients', icon: Users, label: 'Patients', hint: 'Profiles and intake' },
      { path: '/doctors', icon: Stethoscope, label: 'Doctors', hint: 'Roster and expertise' },
      { path: '/appointments', icon: Calendar, label: 'Appointments', hint: 'Bookings and queues' },
      { path: '/departments', icon: Building2, label: 'Departments', hint: 'Units and occupancy' },
      { path: '/records', icon: FileText, label: 'Medical records', hint: 'Clinical notes and history' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { path: '/analytics', icon: BarChart3, label: 'Analytics', hint: 'Performance trends' },
      { path: '/ml-predictions', icon: Brain, label: 'ML predictions', hint: 'Risk and demand signals' },
      { path: '/medicines', icon: Pill, label: 'Medicines', hint: 'Name or image lookup' },
      { path: '/reports', icon: FileSpreadsheet, label: 'Reports', hint: 'Exports and briefings' },
    ],
  },
  {
    title: 'System',
    items: [
      { path: '/users', icon: UserCircle, label: 'Users', hint: 'Access and roles' },
      { path: '/settings', icon: Settings, label: 'Settings', hint: 'Preferences and rules' },
    ],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const visibleSections = useMemo(() => (
    menuSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => canAccessRoute(user?.role, item.path)),
      }))
      .filter((section) => section.items.length > 0)
  ), [user?.role]);

  return (
    <aside className={`app-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="app-sidebar__header">
        <div className="app-sidebar__brand">
          <div className="app-sidebar__brand-mark">
            <Building2 size={22} />
          </div>

          <div>
            <div className="app-sidebar__brand-title">Smart Hospital</div>
            <div className="app-sidebar__brand-subtitle">
              {user?.role ? getPortalLabelForRole(user.role) : 'Clinical operations system'}
            </div>
          </div>
        </div>

        <button
          className="icon-button app-sidebar__close"
          onClick={onClose}
          type="button"
          aria-label="Close navigation"
        >
          <X size={16} />
        </button>
      </div>

      <div className="app-sidebar__status-card">
        <div className="app-sidebar__status-label">Live operations</div>
        <div className="app-sidebar__status-value">87% bed efficiency</div>
        <p className="app-sidebar__status-copy">
          Emergency flow is stable and appointment demand is peaking after noon.
        </p>

        <div className="app-sidebar__status-pills">
          <span className="shell-chip shell-chip--status">
            <Activity size={14} />
            <span>Realtime sync</span>
          </span>
          <span className="shell-chip shell-chip--soft">6 departments active</span>
        </div>
      </div>

      <nav className="app-sidebar__nav">
        {visibleSections.map((section) => (
          <div className="app-sidebar__section" key={section.title}>
            <div className="app-sidebar__section-title">{section.title}</div>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `app-sidebar__link ${isActive ? 'is-active' : ''}`}
                >
                  <div className="app-sidebar__link-icon">
                    <Icon size={18} />
                  </div>

                  <div className="app-sidebar__link-copy">
                    <span className="app-sidebar__link-label">{item.label}</span>
                    <span className="app-sidebar__link-hint">{item.hint}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
