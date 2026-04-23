import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './services/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Loading from './components/common/Loading';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import AdvancedAnalyticsPage from './pages/AdvancedAnalyticsPage';
import MLPredictionsPage from './pages/MLPredictionsPage';
import MedicineIntelligencePage from './pages/MedicineIntelligencePage';
import UserManagementPage from './pages/UserManagementPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import { ROUTE_ACCESS, getDefaultRouteForRole } from './utils/permissions';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return children;
};

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <div
        aria-hidden={!isSidebarOpen}
        className={`app-shell__backdrop ${isSidebarOpen ? 'is-visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="app-shell__content">
        <Navbar onMenuToggle={() => setIsSidebarOpen((open) => !open)} />
        <main className="app-shell__main">
          <div className="app-shell__glow app-shell__glow--one" />
          <div className="app-shell__glow app-shell__glow--two" />
          <div className="app-shell__body">{children}</div>
        </main>
      </div>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/patients']}><MainLayout><PatientsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/doctors']}><MainLayout><DoctorsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/appointments']}><MainLayout><AppointmentsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/departments']}><MainLayout><DepartmentsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/records" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/records']}><MainLayout><MedicalRecordsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/analytics']}><MainLayout><AdvancedAnalyticsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/ml-predictions" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/ml-predictions']}><MainLayout><MLPredictionsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/medicines" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/medicines']}><MainLayout><MedicineIntelligencePage /></MainLayout></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/users']}><MainLayout><UserManagementPage /></MainLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/reports']}><MainLayout><ReportsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/settings']}><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3200,
            style: {
              background: '#10253d',
              color: '#f8fbff',
              border: '1px solid rgba(120, 164, 204, 0.25)',
              boxShadow: '0 20px 45px rgba(6, 21, 37, 0.28)',
            },
            success: {
              iconTheme: {
                primary: '#11b89a',
                secondary: '#f8fbff',
              },
            },
            error: {
              duration: 4200,
              iconTheme: {
                primary: '#f26b5b',
                secondary: '#f8fbff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
