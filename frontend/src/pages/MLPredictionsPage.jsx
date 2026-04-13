import React, { useState } from 'react';
import { Brain, Activity, Calendar, TrendingUp, Pill, AlertCircle, BarChart3, Users } from 'lucide-react';
import { mlAPI } from '../services/api';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

const MLPredictionsPage = () => {
  const [activeTab, setActiveTab] = useState('disease');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Disease Prediction
  const [diseaseForm, setDiseaseForm] = useState({
    symptoms: '',
    age: '',
    gender: 'Male',
  });

  // Readmission Risk
  const [readmissionForm, setReadmissionForm] = useState({
    patient_id: '',
    diagnosis: '',
    length_of_stay: '',
    previous_admissions: '',
  });

  // No-Show Prediction
  const [noShowForm, setNoShowForm] = useState({
    appointment_date: '',
    patient_age: '',
    previous_no_shows: '',
    appointment_type: 'OPD',
  });

  // Length of Stay
  const [lengthForm, setLengthForm] = useState({
    diagnosis: '',
    age: '',
    admission_type: 'Emergency',
    comorbidities: '',
  });

  // Treatment Recommendation
  const [treatmentForm, setTreatmentForm] = useState({
    diagnosis: '',
    symptoms: '',
    patient_age: '',
    medical_history: '',
  });

  const handleDiseasePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await mlAPI.predictDisease(diseaseForm);
      setResult(response.data);
      toast.success('Disease prediction generated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleReadmissionPredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await mlAPI.predictReadmission(readmissionForm);
      setResult(response.data);
      toast.success('Readmission risk calculated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to calculate risk');
    } finally {
      setLoading(false);
    }
  };

  const handleNoShowPredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await mlAPI.predictNoShow(noShowForm);
      setResult(response.data);
      toast.success('No-show prediction generated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleLengthPredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await mlAPI.predictLengthOfStay(lengthForm);
      setResult(response.data);
      toast.success('Length of stay predicted!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to predict length');
    } finally {
      setLoading(false);
    }
  };

  const handleTreatmentRecommend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await mlAPI.recommendTreatment(treatmentForm);
      setResult(response.data);
      toast.success('Treatment recommendations generated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'disease', name: 'Disease Prediction', icon: Activity, color: 'from-blue-500 to-cyan-600' },
    { id: 'readmission', name: 'Readmission Risk', icon: AlertCircle, color: 'from-red-500 to-pink-600' },
    { id: 'noshow', name: 'No-Show Prediction', icon: Calendar, color: 'from-yellow-500 to-orange-600' },
    { id: 'length', name: 'Length of Stay', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
    { id: 'treatment', name: 'Treatment Recommendation', icon: Pill, color: 'from-purple-500 to-pink-600' },
  ];

  const getRiskLevel = (probability) => {
    if (probability >= 0.7) return { level: 'High', color: 'text-red-600 bg-red-100', icon: '🔴' };
    if (probability >= 0.4) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-100', icon: '🟡' };
    return { level: 'Low', color: 'text-green-600 bg-green-100', icon: '🟢' };
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <Brain className="h-10 w-10 mr-4" />
              ML Predictions & Analytics
            </h1>
            <p className="text-purple-100 text-lg">AI-powered insights for better healthcare decisions</p>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm font-semibold">5 ML Models</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setResult(null);
                }}
                className={`p-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-5 w-5 mx-auto mb-2" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Disease Prediction */}
            {activeTab === 'disease' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="h-6 w-6 mr-2 text-blue-600" />
                  Disease Prediction
                </h3>
                <form onSubmit={handleDiseasePredict} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Symptoms <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={diseaseForm.symptoms}
                      onChange={(e) => setDiseaseForm({ ...diseaseForm, symptoms: e.target.value })}
                      className="input-field"
                      rows="4"
                      placeholder="e.g., fever, cough, headache, body pain"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={diseaseForm.age}
                        onChange={(e) => setDiseaseForm({ ...diseaseForm, age: e.target.value })}
                        className="input-field"
                        placeholder="Patient age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={diseaseForm.gender}
                        onChange={(e) => setDiseaseForm({ ...diseaseForm, gender: e.target.value })}
                        className="input-field"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Predict Disease'}
                  </button>
                </form>
              </div>
            )}

            {/* Readmission Risk */}
            {activeTab === 'readmission' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="h-6 w-6 mr-2 text-red-600" />
                  Readmission Risk Prediction
                </h3>
                <form onSubmit={handleReadmissionPredict} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                    <input
                      type="text"
                      value={readmissionForm.patient_id}
                      onChange={(e) => setReadmissionForm({ ...readmissionForm, patient_id: e.target.value })}
                      className="input-field"
                      placeholder="e.g., P001234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Diagnosis <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={readmissionForm.diagnosis}
                      onChange={(e) => setReadmissionForm({ ...readmissionForm, diagnosis: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Diabetes, Heart Failure"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Length of Stay (days)</label>
                      <input
                        type="number"
                        value={readmissionForm.length_of_stay}
                        onChange={(e) => setReadmissionForm({ ...readmissionForm, length_of_stay: e.target.value })}
                        className="input-field"
                        placeholder="7"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Previous Admissions</label>
                      <input
                        type="number"
                        value={readmissionForm.previous_admissions}
                        onChange={(e) => setReadmissionForm({ ...readmissionForm, previous_admissions: e.target.value })}
                        className="input-field"
                        placeholder="2"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate Risk'}
                  </button>
                </form>
              </div>
            )}

            {/* No-Show Prediction */}
            {activeTab === 'noshow' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-orange-600" />
                  Appointment No-Show Prediction
                </h3>
                <form onSubmit={handleNoShowPredict} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={noShowForm.appointment_date}
                      onChange={(e) => setNoShowForm({ ...noShowForm, appointment_date: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Age</label>
                      <input
                        type="number"
                        value={noShowForm.patient_age}
                        onChange={(e) => setNoShowForm({ ...noShowForm, patient_age: e.target.value })}
                        className="input-field"
                        placeholder="45"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Previous No-Shows</label>
                      <input
                        type="number"
                        value={noShowForm.previous_no_shows}
                        onChange={(e) => setNoShowForm({ ...noShowForm, previous_no_shows: e.target.value })}
                        className="input-field"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                    <select
                      value={noShowForm.appointment_type}
                      onChange={(e) => setNoShowForm({ ...noShowForm, appointment_type: e.target.value })}
                      className="input-field"
                    >
                      <option value="OPD">OPD</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Consultation">Consultation</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Predicting...' : 'Predict No-Show'}
                  </button>
                </form>
              </div>
            )}

            {/* Length of Stay */}
            {activeTab === 'length' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                  Length of Stay Prediction
                </h3>
                <form onSubmit={handleLengthPredict} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diagnosis <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lengthForm.diagnosis}
                      onChange={(e) => setLengthForm({ ...lengthForm, diagnosis: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Pneumonia, Surgery"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Age</label>
                      <input
                        type="number"
                        value={lengthForm.age}
                        onChange={(e) => setLengthForm({ ...lengthForm, age: e.target.value })}
                        className="input-field"
                        placeholder="65"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admission Type</label>
                      <select
                        value={lengthForm.admission_type}
                        onChange={(e) => setLengthForm({ ...lengthForm, admission_type: e.target.value })}
                        className="input-field"
                      >
                        <option value="Emergency">Emergency</option>
                        <option value="Elective">Elective</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comorbidities</label>
                    <textarea
                      value={lengthForm.comorbidities}
                      onChange={(e) => setLengthForm({ ...lengthForm, comorbidities: e.target.value })}
                      className="input-field"
                      rows="3"
                      placeholder="List any existing conditions"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Calculating...' : 'Predict Length of Stay'}
                  </button>
                </form>
              </div>
            )}

            {/* Treatment Recommendation */}
            {activeTab === 'treatment' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Pill className="h-6 w-6 mr-2 text-purple-600" />
                  Treatment Recommendation
                </h3>
                <form onSubmit={handleTreatmentRecommend} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diagnosis <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={treatmentForm.diagnosis}
                      onChange={(e) => setTreatmentForm({ ...treatmentForm, diagnosis: e.target.value })}
                      className="input-field"
                      placeholder="Primary diagnosis"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                    <textarea
                      value={treatmentForm.symptoms}
                      onChange={(e) => setTreatmentForm({ ...treatmentForm, symptoms: e.target.value })}
                      className="input-field"
                      rows="3"
                      placeholder="Current symptoms"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Age</label>
                      <input
                        type="number"
                        value={treatmentForm.patient_age}
                        onChange={(e) => setTreatmentForm({ ...treatmentForm, patient_age: e.target.value })}
                        className="input-field"
                        placeholder="45"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                      <input
                        type="text"
                        value={treatmentForm.medical_history}
                        onChange={(e) => setTreatmentForm({ ...treatmentForm, medical_history: e.target.value })}
                        className="input-field"
                        placeholder="Previous conditions"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Generating...' : 'Get Recommendations'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
              Prediction Results
            </h3>
            
            {loading && (
              <div className="text-center py-8">
                <Loading />
                <p className="mt-4 text-gray-600">Analyzing data...</p>
              </div>
            )}

            {!loading && !result && (
              <div className="text-center py-8">
                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Fill the form and submit to see AI predictions</p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-4">
                {/* Prediction */}
                {result.prediction && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-700 mb-2">Prediction</p>
                    <p className="text-lg font-bold text-gray-900">{result.prediction}</p>
                  </div>
                )}

                {/* Probability/Risk */}
                {result.probability !== undefined && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-500">
                    <p className="text-sm font-medium text-gray-700 mb-2">Probability</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-gray-900">
                        {(result.probability * 100).toFixed(1)}%
                      </p>
                      {result.risk_level && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskLevel(result.probability).color}`}>
                          {getRiskLevel(result.probability).icon} {getRiskLevel(result.probability).level}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"
                        style={{ width: `${result.probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Confidence */}
                {result.confidence && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Confidence Level</p>
                    <p className="text-xl font-bold text-green-600">{(result.confidence * 100).toFixed(1)}%</p>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Recommendations</p>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-orange-600 mr-2">•</span>
                          <span className="text-sm text-gray-900">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risk Factors */}
                {result.risk_factors && result.risk_factors.length > 0 && (
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Risk Factors</p>
                    <ul className="space-y-2">
                      {result.risk_factors.map((factor, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-red-600 mr-2">⚠️</span>
                          <span className="text-sm text-gray-900">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Days (Length of Stay) */}
                {result.predicted_days !== undefined && (
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border-l-4 border-cyan-500">
                    <p className="text-sm font-medium text-gray-700 mb-2">Predicted Stay</p>
                    <p className="text-2xl font-bold text-gray-900">{result.predicted_days} days</p>
                  </div>
                )}

                {/* Alternative Diagnoses */}
                {result.alternative_diagnoses && result.alternative_diagnoses.length > 0 && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Alternative Diagnoses</p>
                    <ul className="space-y-2">
                      {result.alternative_diagnoses.map((diag, idx) => (
                        <li key={idx} className="text-sm text-gray-900">
                          {idx + 1}. {diag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Message/Notes */}
                {result.message && (
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 italic">{result.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-xl">
          <Activity className="h-10 w-10 mb-3 opacity-80" />
          <h4 className="text-xl font-bold mb-2">Accuracy</h4>
          <p className="text-3xl font-bold mb-2">85-92%</p>
          <p className="text-blue-100 text-sm">Average model accuracy across all predictions</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-xl">
          <Users className="h-10 w-10 mb-3 opacity-80" />
          <h4 className="text-xl font-bold mb-2">Predictions Made</h4>
          <p className="text-3xl font-bold mb-2">2,450+</p>
          <p className="text-purple-100 text-sm">Total predictions generated this month</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-xl">
          <TrendingUp className="h-10 w-10 mb-3 opacity-80" />
          <h4 className="text-xl font-bold mb-2">Success Rate</h4>
          <p className="text-3xl font-bold mb-2">94%</p>
          <p className="text-green-100 text-sm">Prediction accuracy validation rate</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-6">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-yellow-900 mb-1">Medical Disclaimer</h4>
            <p className="text-sm text-yellow-800">
              These AI predictions are meant to assist healthcare professionals and should not replace professional medical judgment. 
              Always consult with qualified healthcare providers for accurate diagnosis and treatment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPredictionsPage;
