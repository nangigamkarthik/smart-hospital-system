import React, { useEffect, useState } from 'react';
import { Activity, Calendar, Clock3, FileText, Trash2, User, UserPlus } from 'lucide-react';

const mockActivities = [
  {
    id: 1,
    actor: 'Dr. Smith',
    action: 'completed a follow-up with',
    target: 'R. Thompson',
    time: '5 minutes ago',
    icon: Calendar,
    tone: 'blue',
  },
  {
    id: 2,
    actor: 'Reception',
    action: 'registered a new patient',
    target: 'A. Sharma',
    time: '14 minutes ago',
    icon: UserPlus,
    tone: 'mint',
  },
  {
    id: 3,
    actor: 'Dr. Lewis',
    action: 'updated the medical record for',
    target: 'Patient P001234',
    time: '41 minutes ago',
    icon: FileText,
    tone: 'gold',
  },
  {
    id: 4,
    actor: 'Ward admin',
    action: 'adjusted bed allocation for',
    target: 'Neurology',
    time: '1 hour ago',
    icon: Activity,
    tone: 'navy',
  },
  {
    id: 5,
    actor: 'Dr. Chen',
    action: 'requested diagnostics for',
    target: 'M. Davis',
    time: '2 hours ago',
    icon: User,
    tone: 'blue',
  },
  {
    id: 6,
    actor: 'Reception',
    action: 'cancelled the appointment for',
    target: 'L. Anderson',
    time: '3 hours ago',
    icon: Trash2,
    tone: 'coral',
  },
];

const ActivityFeed = ({ limit = 10 }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setActivities(mockActivities.slice(0, limit));
  }, [limit]);

  return (
    <article className="section-card">
      <div className="section-heading">
        <div>
          <div className="section-heading__eyebrow">Realtime log</div>
          <h3 className="section-heading__title">Recent activity</h3>
        </div>
        <div className="shell-chip shell-chip--soft">
          <Clock3 size={14} />
          <span>Updated live</span>
        </div>
      </div>

      <div className="activity-list">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div className="activity-row" key={activity.id}>
              <div className={`activity-row__icon activity-row__icon--${activity.tone}`}>
                <Icon size={16} />
              </div>

              <div className="activity-row__content">
                <p className="activity-row__text">
                  <strong>{activity.actor}</strong> {activity.action} <span>{activity.target}</span>
                </p>
                <div className="activity-row__time">
                  <Clock3 size={12} />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default ActivityFeed;
