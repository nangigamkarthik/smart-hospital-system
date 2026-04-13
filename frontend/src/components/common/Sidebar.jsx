import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  Building2,
  FileText,
  BarChart3,
  Brain,
  Settings,
  FileSpreadsheet,
  Shield,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/patients', name: 'Patients', icon: Users },
    { path: '/doctors', name: 'Doctors', icon: UserCog },
    { path: '/appointments', name: 'Appointments', icon: Calendar },
    { path: '/departments', name: 'Departments', icon: Building2 },
    { path: '/records', name: 'Medical Records', icon: FileText },
    { path: '/analytics', name: 'Analytics', icon: BarChart3 },
    { path: '/ml-predictions', name: 'ML Predictions', icon: Brain },
    { path: '/reports', name: 'Reports', icon: FileSpreadsheet },
    { path: '/users', name: 'Users', icon: Shield },
    { path: '/settings', name: 'Settings', icon: Settings },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center mr-3">
            <span className="text-2xl">🏥</span>
          </div>
          SmartCare
        </h1>
        <p className="text-indigo-100 text-sm mt-1">Hospital Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${active ? 'active' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-600 font-semibold">Quick Stats</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Patients Today</span>
              <span className="font-bold text-indigo-600">24</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Appointments</span>
              <span className="font-bold text-purple-600">18</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
