import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Save, X } from 'lucide-react';
import { patientAPI, doctorAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AddMedicalRecordModal = ({ isOpen, onClose, onSuccess, editRecord = null }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    visit_date: new Date().toISOString().split('T')[0],
    visit_type: 'OPD',
    chief_complaint: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    blood_pressure: '',
    temperature: '',
    pulse_rate: '',
    respiratory_rate: '',
    weight: '',
    height: '',
    lab_tests_ordered: '',
    lab_results: '',
    follow_up_required: false,
    follow_up_date: '',
    follow_up_notes: '',
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchPatientsAndDoctors();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editRecord) {
      setFormData({
        patient_id: editRecord.patient_id || '',
        doctor_id: editRecord.doctor_id || '',
        visit_date: editRecord.visit_date ? editRecord.visit_date.split('T')[0] : '',
        visit_type: editRecord.visit_type || 'OPD',
        chief_complaint: editRecord.chief_complaint || '',
        symptoms: editRecord.symptoms || '',
        diagnosis: editRecord.diagnosis || '',
        treatment: editRecord.treatment || '',
        prescription: editRecord.prescription || '',
        blood_pressure: editRecord.blood_pressure || '',
        temperature: editRecord.temperature || '',
        pulse_rate: editRecord.pulse_rate || '',
        respiratory_rate: editRecord.respiratory_rate || '',
        weight: editRecord.weight || '',
        height: editRecord.height || '',
        lab_tests_ordered: editRecord.lab_tests_ordered || '',
        lab_results: editRecord.lab_results || '',
        follow_up_required: editRecord.follow_up_required || false,
        follow_up_date: editRecord.follow_up_date || '',
        follow_up_notes: editRecord.follow_up_notes || '',
      });
    }
  }, [editRecord]);

  const fetchPatientsAndDoctors = async () => {
    try {
      setLoadingData(true);
      const [patientsRes, doctorsRes] = await Promise.all([
        patientAPI.getAll({ per_page: 1000 }),
        doctorAPI.getAll({ per_page: 1000 }),
      ]);
      setPatients(patientsRes.data.patients || []);
      setDoctors(doctorsRes.data.doctors || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load patients and doctors');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSuccess(formData);
      toast.success(editRecord ? 'Medical record updated!' : 'Medical record created!');
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving medical record:', error);
      toast.error(error.response?.data?.error || 'Failed to save medical record');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      visit_date: new Date().toISOString().split('T')[0],
      visit_type: 'OPD',
      chief_complaint: '',
      symptoms: '',
      diagnosis: '',
      treatment: '',
      prescription: '',
      blood_pressure: '',
      temperature: '',
      pulse_rate: '',
      respiratory_rate: '',
      weight: '',
      height: '',
      lab_tests_ordered: '',
      lab_results: '',
      follow_up_required: false,
      follow_up_date: '',
      follow_up_notes: '',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editRecord ? 'Edit Medical Record' : 'Add New Medical Record'}
      size="xl"
    >
      {loadingData ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
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
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.full_name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visit Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="visit_date"
                  value={formData.visit_date}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visit Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="visit_type"
                  value={formData.visit_type}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="OPD">OPD (Out-Patient)</option>
                  <option value="IPD">IPD (In-Patient)</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chief Complaint & Symptoms */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Complaint & Symptoms</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chief Complaint
                </label>
                <input
                  type="text"
                  name="chief_complaint"
                  value={formData.chief_complaint}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Patient's main complaint"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                  placeholder="List all symptoms observed"
                />
              </div>
            </div>
          </div>

          {/* Diagnosis & Treatment */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis & Treatment</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                  placeholder="Medical diagnosis"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Plan
                </label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                  placeholder="Treatment plan and procedures"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prescription
                </label>
                <textarea
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                  placeholder="Medications prescribed"
                />
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  name="blood_pressure"
                  value={formData.blood_pressure}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="120/80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="98.6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pulse Rate (bpm)
                </label>
                <input
                  type="number"
                  name="pulse_rate"
                  value={formData.pulse_rate}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="72"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Respiratory Rate
                </label>
                <input
                  type="number"
                  name="respiratory_rate"
                  value={formData.respiratory_rate}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="16"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="170"
                />
              </div>
            </div>
          </div>

          {/* Lab Tests */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Laboratory</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tests Ordered
                </label>
                <textarea
                  name="lab_tests_ordered"
                  value={formData.lab_tests_ordered}
                  onChange={handleChange}
                  className="input-field"
                  rows="2"
                  placeholder="List of lab tests ordered"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Results
                </label>
                <textarea
                  name="lab_results"
                  value={formData.lab_results}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                  placeholder="Laboratory test results"
                />
              </div>
            </div>
          </div>

          {/* Follow-up */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow-up</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="follow_up_required"
                  checked={formData.follow_up_required}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Follow-up Required
                </label>
              </div>

              {formData.follow_up_required && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      name="follow_up_date"
                      value={formData.follow_up_date}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Follow-up Notes
                    </label>
                    <textarea
                      name="follow_up_notes"
                      value={formData.follow_up_notes}
                      onChange={handleChange}
                      className="input-field"
                      rows="2"
                      placeholder="Instructions for follow-up visit"
                    />
                  </div>
                </>
              )}
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
                  <span>{editRecord ? 'Update' : 'Save'} Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddMedicalRecordModal;
