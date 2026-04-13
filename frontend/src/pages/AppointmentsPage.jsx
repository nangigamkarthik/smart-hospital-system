import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, CheckCircle, XCircle, PlayCircle, User, Stethoscope, Plus } from 'lucide-react';
import { appointmentAPI } from '../services/api';
import Loading from '../components/common/Loading';
import StatCard from '../components/common/StatCard';
import AddAppointmentModal from '../components/appointments/AddAppointmentModal';
import toast from 'react-hot-toast';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0
  });
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, filterDate, filterStatus]);

  const fetchData = async () => {
    await Promise.all([fetchAppointments(), fetchStats()]);
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAll({
        page: currentPage,
        per_page: 10,
        date: filterDate,
        status: filterStatus,
      });
      
      setAppointments(response.data.appointments);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await appointmentAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, { status: newStatus });
      toast.success('Appointment status updated');
      await fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleModalSuccess = async () => {
    await fetchData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(`2000-01-01T${timeString}`);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      Scheduled: 'bg-blue-100 text-blue-800',
      Confirmed: 'bg-green-100 text-green-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      Completed: 'bg-purple-100 text-purple-800',
      Cancelled: 'bg-red-100 text-red-800',
      'No Show': 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getStatusActions = (appointment) => {
    const actions = [];
    
    if (appointment.status === 'Scheduled') {
      actions.push(
        <button
          key="confirm"
          onClick={() => handleStatusUpdate(appointment.id, 'Confirmed')}
          className="text-green-600 hover:text-green-900 text-sm font-medium"
        >
          Confirm
        </button>
      );
    }
    
    if (appointment.status === 'Confirmed') {
      actions.push(
        <button
          key="start"
          onClick={() => handleStatusUpdate(appointment.id, 'In Progress')}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          Start
        </button>
      );
    }
    
    if (appointment.status === 'In Progress') {
      actions.push(
        <button
          key="complete"
          onClick={() => handleStatusUpdate(appointment.id, 'Completed')}
          className="text-purple-600 hover:text-purple-900 text-sm font-medium"
        >
          Complete
        </button>
      );
    }
    
    if (['Scheduled', 'Confirmed'].includes(appointment.status)) {
      actions.push(
        <button
          key="cancel"
          onClick={() => handleStatusUpdate(appointment.id, 'Cancelled')}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
        >
          Cancel
        </button>
      );
    }
    
    return actions;
  };

  if (loading && appointments.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage and track patient appointments</p>
        </div>
        <button 
          onClick={handleAddAppointment}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Appointments"
          value={stats.total}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="purple"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No Show">No Show</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {appointment.patient_name ? appointment.patient_name.charAt(0) : 'P'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{appointment.patient_name || 'Unknown Patient'}</span>
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center space-x-2 mt-1">
                    <Stethoscope className="h-4 w-4" />
                    <span>{appointment.doctor_name || 'Unknown Doctor'}</span>
                  </p>
                </div>
              </div>
              {getStatusBadge(appointment.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Appointment Date</p>
                <p className="text-sm font-medium text-gray-900 flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(appointment.appointment_date)}</span>
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-sm font-medium text-gray-900 flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(appointment.appointment_time)}</span>
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="text-sm font-medium text-gray-900">{appointment.appointment_type}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-sm font-medium text-gray-900">{appointment.department || 'N/A'}</p>
              </div>
            </div>

            {appointment.reason && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Reason for Visit</p>
                <p className="text-sm text-gray-900">{appointment.reason}</p>
              </div>
            )}

            {appointment.notes && (
              <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                <p className="text-sm text-gray-900">{appointment.notes}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Appointment ID: {appointment.appointment_id}
              </div>
              <div className="flex items-center space-x-3">
                {getStatusActions(appointment)}
                <button
                  onClick={() => handleEditAppointment(appointment)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {appointments.length === 0 && !loading && (
        <div className="card text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No appointments found</p>
          <p className="text-sm text-gray-400 mt-2">
            {filterDate || filterStatus ? 'Try adjusting your filters' : 'Click "Book Appointment" to schedule one'}
          </p>
        </div>
      )}

      {/* Add/Edit Appointment Modal */}
      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        editAppointment={editingAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;
