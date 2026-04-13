import React, { useState, useEffect } from 'react';
import { Activity, User, Calendar, FileText, UserPlus, Edit, Trash2, Clock } from 'lucide-react';

const ActivityFeed = ({ limit = 10 }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Mock activity data
    const mockActivities = [
      {
        id: 1,
        type: 'patient_added',
        user: 'Dr. Smith',
        action: 'registered new patient',
        target: 'John Doe (P001456)',
        time: '5 minutes ago',
        icon: UserPlus,
        color: 'blue',
      },
      {
        id: 2,
        type: 'appointment_booked',
        user: 'Receptionist',
        action: 'booked appointment for',
        target: 'Sarah Williams',
        time: '15 minutes ago',
        icon: Calendar,
        color: 'purple',
      },
      {
        id: 3,
        type: 'record_updated',
        user: 'Dr. Johnson',
        action: 'updated medical record for',
        target: 'Patient P001234',
        time: '1 hour ago',
        icon: Edit,
        color: 'green',
      },
      {
        id: 4,
        type: 'appointment_completed',
        user: 'Dr. Smith',
        action: 'completed appointment with',
        target: 'Michael Brown',
        time: '2 hours ago',
        icon: Calendar,
        color: 'indigo',
      },
      {
        id: 5,
        type: 'record_created',
        user: 'Nurse Davis',
        action: 'created medical record for',
        target: 'Emily White',
        time: '3 hours ago',
        icon: FileText,
        color: 'orange',
      },
      {
        id: 6,
        type: 'patient_updated',
        user: 'Admin',
        action: 'updated patient information for',
        target: 'Robert Taylor',
        time: '4 hours ago',
        icon: User,
        color: 'cyan',
      },
      {
        id: 7,
        type: 'appointment_cancelled',
        user: 'Receptionist',
        action: 'cancelled appointment for',
        target: 'Lisa Anderson',
        time: '5 hours ago',
        icon: Trash2,
        color: 'red',
      },
      {
        id: 8,
        type: 'doctor_added',
        user: 'Admin',
        action: 'added new doctor',
        target: 'Dr. Emily Chen - Cardiology',
        time: '6 hours ago',
        icon: UserPlus,
        color: 'pink',
      },
    ];

    setActivities(mockActivities.slice(0, limit));
  }, [limit]);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      cyan: 'bg-cyan-100 text-cyan-600',
      pink: 'bg-pink-100 text-pink-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Activity className="h-6 w-6 mr-2 text-indigo-600" />
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              {/* Icon */}
              <div className={`p-2 rounded-lg ${getColorClasses(activity.color)} flex-shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{activity.user}</span>{' '}
                  <span className="text-gray-600">{activity.action}</span>{' '}
                  <span className="font-semibold">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}

      <button className="mt-4 w-full text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
        View all activity
      </button>
    </div>
  );
};

export default ActivityFeed;
