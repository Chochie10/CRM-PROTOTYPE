import React, { useState } from 'react';
import { useAuth } from '../../auth/authContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { RoleBasedWrapper } from '../../auth/RBWrapper';
import { ReportFilters } from './Reportfilter';
import { ReportPreview } from './ReportPreview';
import { ExportButtons } from './ExportButton';
import { FileText, FileSpreadsheet, Download, Calendar, Filter } from 'lucide-react';

const ReportsContainer = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('individual');
  const [dateRange, setDateRange] = useState('month');
  const [showPreview, setShowPreview] = useState(false);

  const reportTypes = [
    { value: 'individual', label: 'Individual Performance Report' },
    { value: 'center', label: 'Center Summary Report' },
    { value: 'executive', label: 'Executive Report' },
    { value: 'compliance', label: 'Compliance Report' },
  ];

  const dateRanges = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const getAvailableReports = () => {
    switch (user?.role) {
      case 'SALESPERSON':
        return ['individual', 'compliance'];
      case 'MANAGER':
        return ['individual', 'center', 'compliance'];
      case 'EXECOM':
      case 'ADMIN':
        return ['individual', 'center', 'executive', 'compliance'];
      default:
        return [];
    }
  };

  const availableReports = getAvailableReports();
  const filteredReportTypes = reportTypes.filter(r => availableReports.includes(r.value));

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Role:</strong> {user?.role} | 
          {user?.role === 'MANAGER' && ` Center: ${user?.centerId?.replace('center_', '').toUpperCase()}`}
          {user?.role === 'SALESPERSON' && ` Center: ${user?.centerId?.replace('center_', '').toUpperCase()}`}
          {user?.role === 'EXECOM' && ' Organization-wide visibility'}
          {user?.role === 'ADMIN' && ' Full system access'}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Generate and export performance reports based on your role and access level.
        </p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Generate, preview, and export performance reports</p>
      </div>

      {/* Report Configuration */}
      <Card title="Report Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <Select
              options={filteredReportTypes}
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setShowPreview(false);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <Select
              options={dateRanges}
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setShowPreview(false);
              }}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button 
            variant="primary" 
            onClick={() => setShowPreview(true)}
          >
            <Filter size={16} className="mr-2" />
            Generate Report
          </Button>
        </div>
      </Card>

      {/* Report Preview */}
      {showPreview && (
        <ReportPreview reportType={reportType} dateRange={dateRange} />
      )}

      {/* Export Options */}
      {showPreview && (
        <Card title="Export Options">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ExportButtons format="pdf" reportType={reportType} />
            <ExportButtons format="excel" reportType={reportType} />
            <ExportButtons format="csv" reportType={reportType} />
            <Button variant="secondary" fullWidth>
              <Calendar size={16} className="mr-2" />
              Schedule Report
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsContainer;