import React from 'react';
import { Button } from '../common/Button';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';

interface ExportButtonsProps {
  format: 'pdf' | 'excel' | 'csv';
  reportType: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ format, reportType }) => {
  const handleExport = () => {
    const fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`;
    
    // Simulate export
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}\nFilename: ${fileName}`);
    
    // In a real app, you would call an API to generate and download the file
    console.log(`Exporting ${reportType} report as ${format}`);
  };

  const getIcon = () => {
    switch (format) {
      case 'pdf':
        return <FileText size={16} className="mr-2" />;
      case 'excel':
        return <FileSpreadsheet size={16} className="mr-2" />;
      case 'csv':
        return <Download size={16} className="mr-2" />;
      default:
        return <Download size={16} className="mr-2" />;
    }
  };

  const getLabel = () => {
    switch (format) {
      case 'pdf':
        return 'Export as PDF';
      case 'excel':
        return 'Export as Excel';
      case 'csv':
        return 'Export as CSV';
      default:
        return 'Export';
    }
  };

  const getVariant = () => {
    switch (format) {
      case 'pdf':
        return 'primary';
      case 'excel':
        return 'success';
      case 'csv':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Button variant={getVariant() as any} fullWidth onClick={handleExport}>
      {getIcon()}
      {getLabel()}
    </Button>
  );
};