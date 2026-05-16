import React from 'react';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Calendar, Filter, RefreshCw } from 'lucide-react';

interface ReportFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    dateRange: 'month',
    center: 'all',
    salesperson: 'all',
    status: 'all',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card title="Report Filters">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <Select
            options={[
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'quarter', label: 'Last Quarter' },
              { value: 'year', label: 'Last Year' },
              { value: 'custom', label: 'Custom Range' },
            ]}
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Center
          </label>
          <Select
            options={[
              { value: 'all', label: 'All Centers' },
              { value: 'northgate', label: 'Northgate' },
              { value: 'manila', label: 'Manila' },
              { value: 'cavite', label: 'Cavite' },
              { value: 'baguio', label: 'Baguio' },
            ]}
            value={filters.center}
            onChange={(e) => handleFilterChange('center', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salesperson
          </label>
          <Select
            options={[
              { value: 'all', label: 'All Salespersons' },
              { value: 'john', label: 'John Santos' },
              { value: 'maria', label: 'Maria Reyes' },
              { value: 'carlo', label: 'Carlo Mendoza' },
            ]}
            value={filters.salesperson}
            onChange={(e) => handleFilterChange('salesperson', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'approved', label: 'Approved' },
              { value: 'pending', label: 'Pending' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex gap-3 mt-4">
        <Button variant="primary" size="sm">
          <Filter size={14} className="mr-1" />
          Apply Filters
        </Button>
        <Button variant="secondary" size="sm">
          <RefreshCw size={14} className="mr-1" />
          Reset
        </Button>
      </div>
    </Card>
  );
};