import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Calendar, Clock, User, Stethoscope, FileText, Save, X } from 'lucide-react';
import { patientAPI, doctorAPI, appointmentAPI, departmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AddAppointmentModal = ({ isOpen, onClose, onSuccess, editAppointment = null }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    department_id: '',
    appointment_date: '',
    appointment_time: '',
    appointment_type: 'Consultation',
    reason: '',
    notes: '',
    status: 'Scheduled',
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editAppointment) {
      setFormData({
        patient_id: editAppointment.patient_id || '',
        doctor_id: editAppointment.doctor_id || '',
        department_id: editAppointment.department_id || '',
        appointment_date: editAppointment.appointment_date ? editAppointment.appointment_date.split('T')[0] : '',
        appointment_time: editAppointment.appointment_time || '',
        appointment_type: editAppointment.appointment_type || 'Consultation',
        reason: editAppointment.reason || '',
        notes: editAppointment.notes || '',
        status: editAppointment.status || 'Scheduled',
      });
    }
  }, [editAppointment]);

  useEffect(() => {
    if (formData.department_id) {
      const filtered = doctors.filter(d => d.department_id === parseInt(formData.department_id));
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [formData.department_id, doctors]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [patientsRes, doctorsRes, departmentsRes] = await Promise.all([
        patientAPI.getAll({ per_page: 1000 }),
        doctorAPI.getAll({ per_page: 1000 }),
        departmentAPI.getAll({ per_page: 1000 }),
      ]);
      setPatients(patientsRes.data.patients || []);
      setDoctors(doctorsRes.data.doctors || []);
      setDepartments(departmentsRes.data.departments || []);
      setFilteredDoctors(doctorsRes.data.doctors || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editAppointment) {
        await appointmentAPI.update(editAppointment.id, formData);
        toast.success('Appointment updated successfully!');
      } else {
        await appointmentAPI.create(formData);
        toast.success('Appointment booked successfully!');
      }
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error(error.response?.data?.error || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      department_id: '',
      appointment_date: '',
      appointment_time: '',
      appointment_type: 'Consultation',
      reason: '',
      notes: '',
      status: 'Scheduled',
    });
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '14:00', '14:30', '15:00', '15:30', '16:00',
    '16:30', '17:00', '17:30', '18:00'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editAppointment ? 'Edit Appointment' : 'Book New Appointment'}
      size="lg"
    >
      {loadingData ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient & Department Selection */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Patient Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient <span className="text-red-500">*</span>
                </label>
                <select
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.full_name} - {patient.patient_id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2 text-green-600" />
              Doctor Selection
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor <span className="text-red-500">*</span>
              </label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Doctor</option>
                {filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.full_name} - {doctor.specialization}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-600">
                {filteredDoctors.length} doctor(s) available
                {formData.department_id && ' in selected department'}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Schedule
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  min={getMinDate()}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Slot <span className="text-red-500">*</span>
                </label>
                <select
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-orange-600" />
              Appointment Details
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="appointment_type"
                    value={formData.appointment_type}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Check-up">Check-up</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Lab Test">Lab Test</option>
                  </select>
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
                    <option value="Scheduled">Scheduled</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="input-field"
                  rows="2"
                  placeholder="Brief description of the reason for appointment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="input-field"
                  rows="2"
                  placeholder="Any special instructions or notes"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          {formData.patient_id && formData.doctor_id && formData.appointment_date && (
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-2 border-cyan-200">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Appointment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-semibold text-gray-900">
                    {patients.find(p => p.id === parseInt(formData.patient_id))?.full_name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-semibold text-gray-900">
                    Dr. {doctors.find(d => d.id === parseInt(formData.doctor_id))?.full_name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.appointment_date} at {formData.appointment_time || '--:--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold text-gray-900">{formData.appointment_type}</span>
                </div>
              </div>
            </div>
          )}

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
                  <span>Booking...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>{editAppointment ? 'Update' : 'Book'} Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddAppointmentModal;
