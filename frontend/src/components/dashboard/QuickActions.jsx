import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Calendar, 
  FileText, 
  Users, 
  Stethoscope, 
  Building2,
  Brain,
  Download,
  Settings
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'add-patient',
      title: 'Add Patient',
      description: 'Register new patient',
      icon: UserPlus,
      color: 'from-blue-500 to-cyan-600',
      action: () => navigate('/patients'),
    },
    {
      id: 'book-appointment',
      title: 'Book Appointment',
      description: 'Schedule new appointment',
      icon: Calendar,
      color: 'from-purple-500 to-pink-600',
      action: () => navigate('/appointments'),
    },
    {
      id: 'add-record',
      title: 'Medical Record',
      description: 'Create medical record',
      icon: FileText,
      color: 'from-green-500 to-emerald-600',
      action: () => navigate('/records'),
    },
    {
      id: 'view-patients',
      title: 'View Patients',
      description: 'Browse all patients',
      icon: Users,
      color: 'from-orange-500 to-red-600',
      action: () => navigate('/patients'),
    },
    {
      id: 'add-doctor',
      title: 'Add Doctor',
      description: 'Register new doctor',
      icon: Stethoscope,
      color: 'from-indigo-500 to-purple-600',
      action: () => navigate('/doctors'),
    },
    {
      id: 'manage-departments',
      title: 'Departments',
      description: 'Manage departments',
      icon: Building2,
      color: 'from-pink-500 to-rose-600',
      action: () => navigate('/departments'),
    },
    {
      id: 'ml-predictions',
      title: 'ML Predictions',
      description: 'AI health insights',
      icon: Brain,
      color: 'from-violet-500 to-purple-600',
      action: () => navigate('/ml-predictions'),
    },
    {
      id: 'reports',
      title: 'Generate Report',
      description: 'Export analytics',
      icon: Download,
      color: 'from-teal-500 to-cyan-600',
      action: () => navigate('/reports'),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Settings className="h-6 w-6 mr-2 text-indigo-600" />
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="group relative p-4 rounded-xl border-2 border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-200 text-left"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200`}></div>
              
              {/* Content */}
              <div className="relative">
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-white transition-colors text-sm">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-600 group-hover:text-white/80 transition-colors mt-1">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
