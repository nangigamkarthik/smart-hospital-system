import React, { useState, useEffect } from 'react';
import { Building2, Bed, Phone, Mail, Plus, Edit, Trash2 } from 'lucide-react';
import { departmentAPI } from '../services/api';
import Loading from '../components/common/Loading';
import AddDepartmentModal from '../components/departments/AddDepartmentModal';
import toast from 'react-hot-toast';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAll();
      setDepartments(response.data.departments || response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (departmentData) => {
    await departmentAPI.create(departmentData);
    fetchDepartments();
  };

  const handleEditDepartment = async (departmentData) => {
    await departmentAPI.update(editingDepartment.id, departmentData);
    fetchDepartments();
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      await departmentAPI.delete(id);
      toast.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    }
  };

  const openAddModal = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
  };

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return 'bg-red-500';
    if (rate >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getOccupancyTextColor = (rate) => {
    if (rate >= 90) return 'text-red-700';
    if (rate >= 70) return 'text-yellow-700';
    return 'text-green-700';
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-gray-100 text-gray-800',
      'Under Maintenance': 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const calculateOccupancyRate = (dept) => {
    if (dept.total_beds === 0) return 0;
    return ((dept.total_beds - dept.available_beds) / dept.total_beds * 100).toFixed(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Hospital departments and bed management</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Total Departments</h4>
          <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
        </div>
        <div className="card bg-green-50 border-l-4 border-green-500">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Total Beds</h4>
          <p className="text-2xl font-bold text-gray-900">
            {departments.reduce((acc, dept) => acc + (dept.total_beds || 0), 0)}
          </p>
        </div>
        <div className="card bg-yellow-50 border-l-4 border-yellow-500">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Occupied Beds</h4>
          <p className="text-2xl font-bold text-gray-900">
            {departments.reduce((acc, dept) => acc + ((dept.total_beds || 0) - (dept.available_beds || 0)), 0)}
          </p>
        </div>
        <div className="card bg-purple-50 border-l-4 border-purple-500">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Available Beds</h4>
          <p className="text-2xl font-bold text-gray-900">
            {departments.reduce((acc, dept) => acc + (dept.available_beds || 0), 0)}
          </p>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const occupancyRate = calculateOccupancyRate(dept);
          return (
            <div key={dept.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-600">Code: {dept.code}</p>
                  </div>
                </div>
                {getStatusBadge(dept.status)}
              </div>

              {/* Description */}
              {dept.description && (
                <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
              )}

              {/* Bed Statistics */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Bed className="h-4 w-4 mr-2" />
                    Total Beds
                  </span>
                  <span className="font-semibold">{dept.total_beds || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Occupied</span>
                  <span className="font-semibold">{(dept.total_beds || 0) - (dept.available_beds || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="font-semibold text-green-600">{dept.available_beds || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Floor</span>
                  <span className="font-semibold">{dept.floor || 'N/A'}</span>
                </div>
              </div>

              {/* Occupancy Rate */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Occupancy Rate</span>
                  <span className={`text-sm font-bold ${getOccupancyTextColor(occupancyRate)}`}>
                    {occupancyRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getOccupancyColor(occupancyRate)}`}
                    style={{ width: `${occupancyRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                {dept.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {dept.phone}
                  </div>
                )}
                {dept.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {dept.email}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-end space-x-2">
                <button
                  onClick={() => openEditModal(dept)}
                  className="text-primary-600 hover:text-primary-900 p-2"
                  title="Edit Department"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteDepartment(dept.id)}
                  className="text-red-600 hover:text-red-900 p-2"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {departments.length === 0 && !loading && (
        <div className="card text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No departments found</p>
          <button onClick={openAddModal} className="btn-primary mt-4">
            <Plus className="h-5 w-5 inline mr-2" />
            Add First Department
          </button>
        </div>
      )}

      {/* Add/Edit Department Modal */}
      <AddDepartmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={editingDepartment ? handleEditDepartment : handleAddDepartment}
        editDepartment={editingDepartment}
      />
    </div>
  );
};

export default DepartmentsPage;
