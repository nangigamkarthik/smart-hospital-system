import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddDepartmentModal = ({ isOpen, onClose, onSuccess, editDepartment = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    floor: '',
    phone: '',
    email: '',
    total_beds: '',
    available_beds: '',
    status: 'Active',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editDepartment) {
      setFormData({
        name: editDepartment.name || '',
        code: editDepartment.code || '',
        description: editDepartment.description || '',
        floor: editDepartment.floor || '',
        phone: editDepartment.phone || '',
        email: editDepartment.email || '',
        total_beds: editDepartment.total_beds || '',
        available_beds: editDepartment.available_beds || '',
        status: editDepartment.status || 'Active',
      });
    }
  }, [editDepartment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSuccess(formData);
      toast.success(editDepartment ? 'Department updated successfully!' : 'Department added successfully!');
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error(error.response?.data?.error || 'Failed to save department');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      floor: '',
      phone: '',
      email: '',
      total_beds: '',
      available_beds: '',
      status: 'Active',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editDepartment ? 'Edit Department' : 'Add New Department'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Cardiology"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., CARD"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Brief description of the department"
              />
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Location & Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor
              </label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 3rd Floor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="Department phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="department@hospital.com"
              />
            </div>
          </div>
        </div>

        {/* Bed Management */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Bed Management</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Beds <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="total_beds"
                value={formData.total_beds}
                onChange={handleChange}
                className="input-field"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Beds <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="available_beds"
                value={formData.available_beds}
                onChange={handleChange}
                className="input-field"
                min="0"
                max={formData.total_beds || 9999}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex items-center space-x-2"
            disabled={loading}
          >
            <X className="h-5 w-5" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>{editDepartment ? 'Update' : 'Save'} Department</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDepartmentModal;
