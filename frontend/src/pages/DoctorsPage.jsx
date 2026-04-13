import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, Star } from 'lucide-react';
import { doctorAPI } from '../services/api';
import Loading from '../components/common/Loading';
import AddDoctorModal from '../components/doctors/AddDoctorModal';
import toast from 'react-hot-toast';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, [currentPage, search, filterStatus, filterSpecialization]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAll({
        page: currentPage,
        per_page: 10,
        specialization: filterSpecialization,
        status: filterStatus,
      });
      
      setDoctors(response.data.doctors);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await doctorAPI.getSpecializations();
      setSpecializations(response.data.specializations);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const handleAddDoctor = async (doctorData) => {
    await doctorAPI.create(doctorData);
    fetchDoctors();
  };

  const handleEditDoctor = async (doctorData) => {
    await doctorAPI.update(editingDoctor.id, doctorData);
    fetchDoctors();
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      await doctorAPI.delete(id);
      toast.success('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error('Failed to delete doctor');
    }
  };

  const openAddModal = () => {
    setEditingDoctor(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: 'bg-green-100 text-green-800',
      'On Leave': 'bg-yellow-100 text-yellow-800',
      Inactive: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="text-sm font-medium text-gray-700">{rating?.toFixed(1) || 'N/A'}</span>
      </div>
    );
  };

  if (loading && doctors.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1">Manage doctor profiles and schedules</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Specialization Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterSpecialization}
              onChange={(e) => {
                setFilterSpecialization(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {doctor.first_name[0]}{doctor.last_name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {doctor.full_name}
                  </h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                </div>
              </div>
              {getStatusBadge(doctor.status)}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">{doctor.experience_years} years</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-medium">₹{doctor.consultation_fee}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Patients Treated:</span>
                <span className="font-medium">{doctor.total_patients_treated}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rating:</span>
                {renderRating(doctor.rating)}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {doctor.phone}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(doctor)}
                  className="text-primary-600 hover:text-primary-900 p-1"
                  title="Edit Doctor"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteDoctor(doctor.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card flex items-center justify-between">
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
      )}

      {doctors.length === 0 && !loading && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No doctors found</p>
        </div>
      )}

      {/* Add/Edit Doctor Modal */}
      <AddDoctorModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={editingDoctor ? handleEditDoctor : handleAddDoctor}
        editDoctor={editingDoctor}
      />
    </div>
  );
};

export default DoctorsPage;
