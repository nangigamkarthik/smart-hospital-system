import React from 'react';
import Modal from '../common/Modal';
import { User, Phone, Mail, MapPin, AlertCircle, Heart, FileText, Shield } from 'lucide-react';

const ViewPatientModal = ({ isOpen, onClose, patient }) => {
  if (!patient) return null;

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const InfoSection = ({ icon: Icon, title, children }) => (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Icon className="h-5 w-5 text-primary-600" />
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        {children}
      </div>
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-1">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className="text-sm text-gray-900">{value || 'N/A'}</span>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Patient Details" size="lg">
      <div className="space-y-6">
        {/* Header with Patient Basic Info */}
        <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
          <div className="h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {patient.first_name[0]}{patient.last_name[0]}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{patient.full_name}</h3>
            <p className="text-sm text-gray-600">Patient ID: {patient.patient_id}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {patient.gender}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Age: {calculateAge(patient.date_of_birth)} years
              </span>
              {patient.blood_group && (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                  {patient.blood_group}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <InfoSection icon={User} title="Personal Information">
            <InfoRow label="Date of Birth" value={patient.date_of_birth} />
            <InfoRow label="Gender" value={patient.gender} />
            <InfoRow label="Blood Group" value={patient.blood_group} />
            <InfoRow label="Status" value={patient.status} />
            <InfoRow label="Registered Date" value={patient.registered_date ? new Date(patient.registered_date).toLocaleDateString() : 'N/A'} />
            <InfoRow label="Last Visit" value={patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : 'N/A'} />
          </InfoSection>

          {/* Contact Information */}
          <InfoSection icon={Phone} title="Contact Information">
            <InfoRow label="Phone" value={patient.phone} />
            <InfoRow label="Email" value={patient.email} />
            <InfoRow label="City" value={patient.city} />
            <InfoRow label="State" value={patient.state} />
            <InfoRow label="Pincode" value={patient.pincode} />
          </InfoSection>
        </div>

        {/* Address */}
        {patient.address && (
          <InfoSection icon={MapPin} title="Address">
            <p className="text-sm text-gray-900">{patient.address}</p>
          </InfoSection>
        )}

        {/* Emergency Contact */}
        <InfoSection icon={AlertCircle} title="Emergency Contact">
          <InfoRow label="Name" value={patient.emergency_contact_name} />
          <InfoRow label="Phone" value={patient.emergency_contact_phone} />
          <InfoRow label="Relation" value={patient.emergency_contact_relation} />
        </InfoSection>

        {/* Medical Information */}
        <InfoSection icon={Heart} title="Medical Information">
          <div className="space-y-3">
            {patient.allergies && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Allergies:</p>
                <p className="text-sm text-gray-900 bg-red-50 p-2 rounded">{patient.allergies}</p>
              </div>
            )}
            {patient.chronic_conditions && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Chronic Conditions:</p>
                <p className="text-sm text-gray-900 bg-yellow-50 p-2 rounded">{patient.chronic_conditions}</p>
              </div>
            )}
            {patient.current_medications && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Current Medications:</p>
                <p className="text-sm text-gray-900 bg-blue-50 p-2 rounded">{patient.current_medications}</p>
              </div>
            )}
            {!patient.allergies && !patient.chronic_conditions && !patient.current_medications && (
              <p className="text-sm text-gray-500 italic">No medical information recorded</p>
            )}
          </div>
        </InfoSection>

        {/* Insurance Information */}
        <InfoSection icon={Shield} title="Insurance Information">
          <InfoRow label="Provider" value={patient.insurance_provider} />
          <InfoRow label="Policy Number" value={patient.insurance_number} />
        </InfoSection>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewPatientModal;
