import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Bell,
  CalendarDays,
  Clock3,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../services/AuthContext';
import { getPortalLabelForRole } from '../../utils/permissions';

const routeMeta = {
  '/': {
    byRole: {
      Admin: {
        section: 'Admin Command',
        title: 'Hospital Command Center',
        description: 'Oversee hospital performance, users, reporting, and system-wide activity from one place.',
      },
      Doctor: {
        section: 'Doctor Workspace',
        title: 'Clinical Care Overview',
        description: 'Review patient flow, appointments, records, and decision-support tools for active care.',
      },
      default: {
        section: 'Staff Operations',
        title: 'Daily Front Desk Overview',
        description: 'Keep appointments, patient movement, and department coordination moving smoothly.',
      },
    },
  },
  '/patients': {
    section: 'Patient Care',
    title: 'Patient Directory',
    description: 'Review records, status changes, and intake details without losing context.',
  },
  '/doctors': {
    section: 'Clinical Team',
    title: 'Doctor Roster',
    description: 'Keep specialist availability, assignments, and staffing visibility up to date.',
  },
  '/appointments': {
    section: 'Scheduling',
    title: 'Appointment Operations',
    description: 'Manage bookings, no-show risk, and queue pressure across departments.',
  },
  '/departments': {
    section: 'Capacity',
    title: 'Department Performance',
    description: 'Monitor throughput, occupancy, and service bottlenecks department by department.',
  },
  '/records': {
    section: 'Medical History',
    title: 'Clinical Records',
    description: 'Access care history, documentation quality, and patient summaries quickly.',
  },
  '/analytics': {
    section: 'Insights',
    title: 'Advanced Analytics',
    description: 'See the trends behind patient demand, treatment outcomes, and operations.',
  },
  '/ml-predictions': {
    section: 'Intelligence',
    title: 'Predictive Monitoring',
    description: 'Use smart forecasts to anticipate risk, capacity issues, and demand spikes.',
  },
  '/medicines': {
    section: 'Pharmacy Support',
    title: 'Medicine Intelligence',
    description: 'Search a medicine by name or label image and review official use, safety, and age guidance.',
  },
  '/reports': {
    section: 'Reporting',
    title: 'Executive Reports',
    description: 'Export polished reports for leadership, audits, and daily standups.',
  },
  '/users': {
    section: 'Administration',
    title: 'User Management',
    description: 'Control access, permissions, and role-based workflows with less friction.',
  },
  '/settings': {
    section: 'Configuration',
    title: 'System Settings',
    description: 'Tune preferences, policies, and defaults for a smoother hospital workflow.',
  },
};

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  const handleNotificationsClick = () => {
    toast.success(`No new ${getPortalLabelForRole(user?.role).toLowerCase()} alerts right now.`);
  };

  const meta = useMemo(() => {
    const currentMeta = routeMeta[location.pathname] || routeMeta['/'];
    if (currentMeta.byRole) {
      return currentMeta.byRole[user?.role] || currentMeta.byRole.default;
    }
    return currentMeta;
  }, [location.pathname, user?.role]);

  const formattedDate = useMemo(() => (
    new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  ), []);

  const formattedTime = useMemo(() => (
    new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  ), []);

  return (
    <header className="shell-topbar">
      <div className="shell-topbar__intro">
        <button
          className="icon-button shell-mobile-toggle"
          onClick={onMenuToggle}
          type="button"
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        <div>
          <div className="shell-topbar__eyebrow">{meta.section}</div>
          <h1 className="shell-topbar__title">{meta.title}</h1>
          <p className="shell-topbar__subtitle">{meta.description}</p>
        </div>
      </div>

      <div className="shell-topbar__actions">
        <div className="shell-chip shell-chip--status">
          <ShieldCheck size={15} />
          <span>System healthy</span>
        </div>

        <div className="shell-chip shell-chip--soft">
          <CalendarDays size={15} />
          <span>{formattedDate}</span>
        </div>

        <div className="shell-chip shell-chip--soft hide-on-tablet">
          <Clock3 size={15} />
          <span>{formattedTime}</span>
        </div>

        <button
          className="icon-button"
          onClick={handleNotificationsClick}
          title="Notifications"
          type="button"
        >
          <Bell size={18} />
          <span className="icon-button__dot" />
        </button>

        <button
          className="icon-button hide-on-tablet"
          onClick={() => navigate('/settings')}
          title="Settings"
          type="button"
        >
          <Settings size={18} />
        </button>

        <div className="user-menu" ref={menuRef}>
          <button
            className="user-menu__trigger"
            onClick={() => setShowUserMenu((open) => !open)}
            type="button"
          >
            <div className="user-menu__avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="user-menu__meta">
              <span className="user-menu__name">{user?.username || 'User'}</span>
              <span className="user-menu__role">
                {user?.role ? `${user.role} - ${getPortalLabelForRole(user.role)}` : 'Administrator'}
              </span>
            </div>

            <div className="user-menu__health hide-on-tablet">
              <Activity size={15} />
              <span>On shift</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="user-menu__dropdown">
              <button
                className="user-menu__item"
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                type="button"
              >
                <User size={16} />
                <span>Profile & preferences</span>
              </button>

              <button
                className="user-menu__item"
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                type="button"
              >
                <Settings size={16} />
                <span>System settings</span>
              </button>

              <button
                className="user-menu__item user-menu__item--danger"
                onClick={handleLogout}
                type="button"
              >
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
