import React, { useState } from 'react';
import { FileText, Download, Calendar, Users, Activity, TrendingUp, Filter, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('patients');
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
  });
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'patients',
      name: 'Patient Report',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      description: 'Comprehensive patient statistics and demographics',
    },
    {
      id: 'appointments',
      name: 'Appointment Report',
      icon: Calendar,
      color: 'from-purple-500 to-pink-600',
      description: 'Appointment trends, status, and utilization',
    },
    {
      id: 'revenue',
      name: 'Revenue Report',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      description: 'Financial overview and revenue analysis',
    },
    {
      id: 'medical',
      name: 'Medical Records Report',
      icon: FileText,
      color: 'from-orange-500 to-red-600',
      description: 'Medical records summary and statistics',
    },
    {
      id: 'department',
      name: 'Department Report',
      icon: Activity,
      color: 'from-indigo-500 to-purple-600',
      description: 'Department performance and metrics',
    },
  ];

  const handleGenerateReport = async () => {
    if (!dateRange.start_date || !dateRange.end_date) {
      toast.error('Please select date range');
      return;
    }

    setGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      toast.success(`${reportTypes.find(r => r.id === reportType)?.name} generated successfully!`);
      setGenerating(false);
      
      // Trigger download (mock)
      const filename = `${reportType}_report_${dateRange.start_date}_to_${dateRange.end_date}.${format}`;
      console.log(`Downloading: ${filename}`);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const quickReports = [
    { name: 'Today\'s Appointments', count: 24, change: '+12%', trend: 'up' },
    { name: 'New Patients This Month', count: 156, change: '+8%', trend: 'up' },
    { name: 'Pending Medical Records', count: 12, change: '-5%', trend: 'down' },
    { name: 'Revenue This Month', count: '$45,230', change: '+15%', trend: 'up' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen no-print">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <FileText className="h-10 w-10 mr-4" />
              Reports & Analytics
            </h1>
            <p className="text-indigo-100 text-lg">Generate comprehensive reports and export data</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handlePrint}
              className="bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Printer className="h-5 w-5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickReports.map((report, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <h3 className="text-sm text-gray-600 mb-2">{report.name}</h3>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">{report.count}</p>
              <span className={`text-sm font-semibold ${
                report.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {report.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Report Type</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    onClick={() => setReportType(report.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      reportType === report.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${report.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{report.name}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Report Filters */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-indigo-600" />
                Report Filters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dateRange.start_date}
                    onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dateRange.end_date}
                    onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    const today = new Date();
                    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    setDateRange({
                      start_date: lastWeek.toISOString().split('T')[0],
                      end_date: today.toISOString().split('T')[0],
                    });
                  }}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 text-sm font-medium transition-all"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    setDateRange({
                      start_date: lastMonth.toISOString().split('T')[0],
                      end_date: today.toISOString().split('T')[0],
                    });
                  }}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 text-sm font-medium transition-all"
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                    setDateRange({
                      start_date: firstDay.toISOString().split('T')[0],
                      end_date: today.toISOString().split('T')[0],
                    });
                  }}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 text-sm font-medium transition-all"
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Export Format */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Download className="h-5 w-5 mr-2 text-purple-600" />
                Export Format
              </h3>
              
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { value: 'pdf', label: 'PDF', color: 'red' },
                  { value: 'excel', label: 'Excel', color: 'green' },
                  { value: 'csv', label: 'CSV', color: 'blue' },
                  { value: 'json', label: 'JSON', color: 'purple' },
                ].map((fmt) => (
                  <button
                    key={fmt.value}
                    onClick={() => setFormat(fmt.value)}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                      format === fmt.value
                        ? `border-${fmt.color}-500 bg-${fmt.color}-50 text-${fmt.color}-700 shadow-lg`
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateReport}
                disabled={generating || !dateRange.start_date || !dateRange.end_date}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Report...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Generate & Download Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview & Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Report Preview</h3>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Selected Report</p>
                <p className="text-lg font-bold text-gray-900">
                  {reportTypes.find(r => r.id === reportType)?.name || 'None'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Date Range</p>
                <p className="text-sm font-bold text-gray-900">
                  {dateRange.start_date && dateRange.end_date
                    ? `${dateRange.start_date} to ${dateRange.end_date}`
                    : 'Not selected'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Export Format</p>
                <p className="text-lg font-bold text-gray-900 uppercase">{format}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-400">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Report generation may take a few moments depending on the data size.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Report Includes:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Summary statistics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Detailed data tables</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Visual charts & graphs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Trend analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Date Range</th>
                <th>Generated</th>
                <th>Format</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'Patient Statistics Q1 2024',
                  type: 'Patient Report',
                  range: '2024-01-01 to 2024-03-31',
                  generated: '2024-03-13',
                  format: 'PDF',
                },
                {
                  name: 'Monthly Revenue Report',
                  type: 'Revenue Report',
                  range: '2024-02-01 to 2024-02-29',
                  generated: '2024-03-01',
                  format: 'Excel',
                },
                {
                  name: 'Department Performance',
                  type: 'Department Report',
                  range: '2024-01-01 to 2024-02-28',
                  generated: '2024-02-28',
                  format: 'PDF',
                },
              ].map((report, idx) => (
                <tr key={idx}>
                  <td className="font-semibold">{report.name}</td>
                  <td>{report.type}</td>
                  <td className="text-sm">{report.range}</td>
                  <td className="text-sm">{report.generated}</td>
                  <td>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                      {report.format}
                    </span>
                  </td>
                  <td>
                    <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
