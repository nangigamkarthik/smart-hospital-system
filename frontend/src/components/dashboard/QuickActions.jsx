import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Building2,
  Calendar,
  Download,
  FileText,
  Pill,
  Plus,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useAuth } from '../../services/AuthContext';
import { canAccessAction } from '../../utils/permissions';

const actions = [
  {
    id: 'patient-intake',
    title: 'New patient intake',
    description: 'Capture registration details and send them into triage.',
    icon: Plus,
    path: '/patients',
  },
  {
    id: 'doctor-roster',
    title: 'Review doctor roster',
    description: 'Check availability before the next appointment rush.',
    icon: Stethoscope,
    path: '/doctors',
  },
  {
    id: 'schedule',
    title: 'Open scheduler',
    description: 'Adjust bookings, reminder flow, and queue balance.',
    icon: Calendar,
    path: '/appointments',
  },
  {
    id: 'records',
    title: 'Medical records',
    description: 'Open clinical notes, summaries, and current history.',
    icon: FileText,
    path: '/records',
  },
  {
    id: 'departments',
    title: 'Department capacity',
    description: 'See where bed load and staffing pressure are rising.',
    icon: Building2,
    path: '/departments',
  },
  {
    id: 'patients',
    title: 'Patient directory',
    description: 'Search existing patients and follow their current status.',
    icon: Users,
    path: '/patients',
  },
  {
    id: 'predictions',
    title: 'Predictive insights',
    description: 'Run the smart forecast view for care and queue risk.',
    icon: Brain,
    path: '/ml-predictions',
  },
  {
    id: 'medicines',
    title: 'Medicine lookup',
    description: 'Check official usage, side effects, and age guidance quickly.',
    icon: Pill,
    path: '/medicines',
  },
  {
    id: 'reports',
    title: 'Generate reports',
    description: 'Export a fresh summary for leadership or daily standup.',
    icon: Download,
    path: '/reports',
  },
];

const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const visibleActions = actions.filter((action) => canAccessAction(user?.role, action.id));

  return (
    <article className="section-card">
      <div className="section-heading">
        <div>
          <div className="section-heading__eyebrow">Fast lane</div>
          <h3 className="section-heading__title">Quick actions</h3>
        </div>
        <div className="shell-chip shell-chip--soft">
          <Settings size={14} />
          <span>Role-based shortcuts</span>
        </div>
      </div>

      <div className="action-grid">
        {visibleActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              className="action-tile"
              key={action.id}
              onClick={() => navigate(action.path)}
              type="button"
            >
              <div className="action-tile__icon">
                <Icon size={18} />
              </div>

              <div className="action-tile__copy">
                <span className="action-tile__title">{action.title}</span>
                <span className="action-tile__description">{action.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </article>
  );
};

export default QuickActions;
