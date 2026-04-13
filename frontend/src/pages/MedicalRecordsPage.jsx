import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, FileText, Activity, Thermometer, Eye, Edit, Trash2, Clock, User, Stethoscope } from 'lucide-react';
import { medicalRecordsAPI } from '../services/api';
import Loading from '../components/common/Loading';
import AddMedicalRecordModal from '../components/medical-records/AddMedicalRecordModal';
import toast from 'react-hot-toast';

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [expandedRecord, setExpandedRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [currentPage, search]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await medicalRecordsAPI.getAll({
        page: currentPage,
        per_page: 10,
        search: search,
      });
      
      setRecords(response.data.records || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleAddRecord = async (recordData) => {
    await medicalRecordsAPI.create(recordData);
    fetchRecords();
  };

  const handleEditRecord = async (recordData) => {
    await medicalRecordsAPI.update(editingRecord.id, recordData);
    fetchRecords();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medical record?')) {
      return;
    }

    try {
      await medicalRecordsAPI.delete(id);
      toast.success('Medical record deleted successfully');
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete medical record');
    }
  };

  const openAddModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const toggleExpand = (recordId) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const getVisitTypeBadge = (type) => {
    const styles = {
      OPD: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm',
      IPD: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 shadow-sm',
      Emergency: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm',
      Surgery: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 shadow-sm',
      'Follow-up': 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-sm',
    };
    
    return (
      <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${styles[type] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && records.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Medical Records</h1>
            <p className="text-indigo-100 text-lg">Comprehensive patient health documentation</p>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Modern Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name, record ID, diagnosis..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
          />
        </div>
      </div>

      {/* Records List with Modern Cards */}
      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-4 border-indigo-500">
            {/* Card Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                      <User className="h-5 w-5 text-indigo-600" />
                      <span>{record.patient_name || 'Unknown Patient'}</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Record ID: <span className="font-mono font-semibold">{record.record_id}</span></p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getVisitTypeBadge(record.visit_type)}
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1 flex items-center">
                    <Stethoscope className="h-3 w-3 mr-1" />
                    Doctor
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{record.doctor_name || 'N/A'}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Visit Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(record.visit_date)}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Visit Type</p>
                  <p className="text-sm font-semibold text-gray-900">{record.visit_type}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1 flex items-center">
                    <Activity className="h-3 w-3 mr-1" />
                    Status
                  </p>
                  <p className="text-sm font-semibold text-green-600">Completed</p>
                </div>
              </div>

              {/* Main Content - Collapsible */}
              {expandedRecord === record.id ? (
                <div className="space-y-4 mt-4 pt-4 border-t-2 border-gray-100">
                  {/* Complaint and Symptoms */}
                  {(record.chief_complaint || record.symptoms) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {record.chief_complaint && (
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-l-4 border-yellow-400">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Chief Complaint</p>
                          <p className="text-sm text-gray-900">{record.chief_complaint}</p>
                        </div>
                      )}
                      {record.symptoms && (
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-l-4 border-orange-400">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Symptoms</p>
                          <p className="text-sm text-gray-900">{record.symptoms}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Diagnosis and Treatment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Diagnosis</p>
                      <p className="text-sm text-gray-900">{record.diagnosis || 'N/A'}</p>
                    </div>

                    {record.treatment && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Treatment</p>
                        <p className="text-sm text-gray-900">{record.treatment}</p>
                      </div>
                    )}
                  </div>

                  {/* Prescription */}
                  {record.prescription && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-500">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Prescription</p>
                      <p className="text-sm text-gray-900 whitespace-pre-line">{record.prescription}</p>
                    </div>
                  )}

                  {/* Vital Signs */}
                  {(record.temperature || record.blood_pressure || record.pulse_rate) && (
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-red-500" />
                        Vital Signs
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {record.temperature && (
                          <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                            <Thermometer className="h-4 w-4 text-red-500" />
                            <div>
                              <p className="text-xs text-gray-600">Temperature</p>
                              <p className="text-sm font-bold text-gray-900">{record.temperature}°F</p>
                            </div>
                          </div>
                        )}
                        {record.blood_pressure && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs text-gray-600">Blood Pressure</p>
                            <p className="text-sm font-bold text-gray-900">{record.blood_pressure}</p>
                          </div>
                        )}
                        {record.pulse_rate && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs text-gray-600">Pulse Rate</p>
                            <p className="text-sm font-bold text-gray-900">{record.pulse_rate} bpm</p>
                          </div>
                        )}
                        {record.respiratory_rate && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs text-gray-600">Respiratory Rate</p>
                            <p className="text-sm font-bold text-gray-900">{record.respiratory_rate} /min</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Lab Tests */}
                  {(record.lab_tests_ordered || record.lab_results) && (
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Laboratory</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {record.lab_tests_ordered && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs text-gray-600 mb-1">Tests Ordered</p>
                            <p className="text-sm text-gray-900">{record.lab_tests_ordered}</p>
                          </div>
                        )}
                        {record.lab_results && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs text-gray-600 mb-1">Results</p>
                            <p className="text-sm text-gray-900">{record.lab_results}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Follow-up */}
                  {record.follow_up_required && (
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-400">
                      <p className="text-sm font-bold text-gray-900 mb-2">⚠️ Follow-up Required</p>
                      {record.follow_up_date && (
                        <p className="text-sm text-gray-900">Date: <span className="font-semibold">{formatDate(record.follow_up_date)}</span></p>
                      )}
                      {record.follow_up_notes && (
                        <p className="text-sm text-gray-600 mt-1">{record.follow_up_notes}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700">
                    <span className="font-semibold">Diagnosis:</span> {record.diagnosis?.substring(0, 100)}{record.diagnosis?.length > 100 ? '...' : ''}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-gray-100">
                <button
                  onClick={() => toggleExpand(record.id)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center space-x-1 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>{expandedRecord === record.id ? 'Show Less' : 'View Full Details'}</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(record)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Record"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page <span className="font-bold text-indigo-600">{currentPage}</span> of{' '}
              <span className="font-bold text-indigo-600">{totalPages}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {records.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-lg text-center py-16">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No medical records found</h3>
          <p className="text-gray-500 mb-6">
            {search ? 'Try adjusting your search' : 'Start by adding your first medical record'}
          </p>
          <button onClick={openAddModal} className="btn-primary inline-flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add First Record</span>
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddMedicalRecordModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={editingRecord ? handleEditRecord : handleAddRecord}
        editRecord={editingRecord}
      />
    </div>
  );
};

export default MedicalRecordsPage;
