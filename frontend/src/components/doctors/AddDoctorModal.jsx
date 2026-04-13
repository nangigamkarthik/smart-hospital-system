import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddDoctorModal = ({ isOpen, onClose, onSuccess, editDoctor = null }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: 'Male',
    date_of_birth: '',
    phone: '',
    email: '',
    address: '',
    specialization: '',
    qualification: '',
    experience_years: '',
    license_number: '',
    consultation_fee: '',
    available_days: '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]',
  });

  const [loading, setLoading] = useState(false);

  const specializations = [
    'Cardiologist',
    'Neurologist',
    'Orthopedic Surgeon',
    'Pediatrician',
    'Emergency Medicine',
    'General Physician',
    'Surgeon',
    'Gynecologist',
    'Dermatologist',
    'Psychiatrist',
    'Radiologist',
    'Anesthesiologist',
  ];

  useEffect(() => {
    if (editDoctor) {
      setFormData({
        first_name: editDoctor.first_name || '',
        last_name: editDoctor.last_name || '',
        gender: editDoctor.gender || 'Male',
        date_of_birth: editDoctor.date_of_birth || '',
        phone: editDoctor.phone || '',
        email: editDoctor.email || '',
        address: editDoctor.address || '',
        specialization: editDoctor.specialization || '',
        qualification: editDoctor.qualification || '',
        experience_years: editDoctor.experience_years || '',
        license_number: editDoctor.license_number || '',
        consultation_fee: editDoctor.consultation_fee || '',
        available_days: editDoctor.available_days || '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]',
      });
    }
  }, [editDoctor]);

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
      toast.success(editDoctor ? 'Doctor updated successfully!' : 'Doctor added successfully!');
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast.error(error.response?.data?.error || 'Failed to save doctor');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      gender: 'Male',
      date_of_birth: '',
      phone: '',
      email: '',
      address: '',
      specialization: '',
      qualification: '',
      experience_years: '',
      license_number: '',
      consultation_fee: '',
      available_days: '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editDoctor ? 'Edit Doctor' : 'Add New Doctor'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization <span className="text-red-500">*</span>
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., MBBS, MD"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                className="input-field"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                name="consultation_fee"
                value={formData.consultation_fee}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="0.01"
              />
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
                <span>{editDoctor ? 'Update' : 'Save'} Doctor</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDoctorModal;
