import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/authContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { AlertCircle, CheckCircle, Clock, Calendar } from 'lucide-react';
import  { MOCK_USERS } from '../../../data/mockUsers';
import { MOCK_DAILY_SALES } from '../../../data/mockSales';

interface ComplianceData {
  userId: string;
  userName: string;
  expectedSubmissions: number;
  actualSubmissions: number;
  complianceRate: number;
  missedDates: string[];
  status: 'Good' | 'Warning' | 'Critical';
  lastSubmissionDate: string;
}

export const ComplianceTracker = () => {
  const { user } = useAuth();
  const [complianceData, setComplianceData] = useState<ComplianceData[]>([]);
  const [overallCompliance, setOverallCompliance] = useState(0);

  useEffect(() => {
    if (user?.centerId) {
      const team = MOCK_USERS.filter(u => u.centerId === user.centerId && u.role === "SALESPERSON");
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      
      const data = team.map(member => {
        const memberSales = MOCK_DAILY_SALES.filter(sale => 
          sale.userId === member.id &&
          new Date(sale.date).getMonth() === currentMonth &&
          new Date(sale.date).getFullYear() === currentYear
        );
        
        const actualSubmissions = memberSales.length;
        const expectedSubmissions = daysInMonth;
        const complianceRate = (actualSubmissions / expectedSubmissions) * 100;
        
        // Find missed dates
        const submittedDates = memberSales.map(s => s.date);
        const missedDates = [];
        for (let i = 1; i <= daysInMonth; i++) {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
          if (!submittedDates.includes(dateStr) && new Date(dateStr) <= new Date()) {
            missedDates.push(dateStr);
          }
        }
        
        let status: 'Good' | 'Warning' | 'Critical' = 'Good';
        if (complianceRate < 70) status = 'Critical';
        else if (complianceRate < 90) status = 'Warning';
        
        const lastSubmission = memberSales.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        
        return {
          userId: member.id,
          userName: member.name,
          expectedSubmissions,
          actualSubmissions,
          complianceRate,
          missedDates: missedDates.slice(0, 5), // Show last 5 missed dates
          status,
          lastSubmissionDate: lastSubmission?.date || 'No submissions',
        };
      });
      
      setComplianceData(data);
      
      const avgCompliance = data.reduce((sum, d) => sum + d.complianceRate, 0) / data.length;
      setOverallCompliance(avgCompliance);
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'text-green-600 bg-green-50';
      case 'Warning': return 'text-yellow-600 bg-yellow-50';
      case 'Critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good': return <CheckCircle size={16} />;
      case 'Warning': return <AlertCircle size={16} />;
      case 'Critical': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <Card title="Team Compliance Overview">
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Overall Team Compliance</p>
            <p className="text-2xl font-bold text-blue-600">{overallCompliance.toFixed(1)}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Submission Rate</p>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 rounded-full h-2 transition-all"
                style={{ width: `${Math.min(overallCompliance, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {complianceData.map((member) => (
          <div key={member.userId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{member.userName}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Last submission: {member.lastSubmissionDate}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(member.status)}`}>
                {getStatusIcon(member.status)}
                <span className="text-sm font-medium">{member.status}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-500">Submissions</p>
                <p className="text-lg font-semibold text-gray-900">
                  {member.actualSubmissions} / {member.expectedSubmissions}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Compliance Rate</p>
                <p className="text-lg font-semibold" style={{
                  color: member.complianceRate >= 90 ? '#10B981' : member.complianceRate >= 70 ? '#F59E0B' : '#EF4444'
                }}>
                  {member.complianceRate.toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="rounded-full h-2 transition-all"
                style={{
                  width: `${Math.min(member.complianceRate, 100)}%`,
                  backgroundColor: member.complianceRate >= 90 ? '#10B981' : member.complianceRate >= 70 ? '#F59E0B' : '#EF4444'
                }}
              />
            </div>
            
            {member.missedDates.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-red-600 font-medium mb-2">
                  Missed Submission Dates:
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.missedDates.map((date, idx) => (
                    <Badge key={idx} variant="danger" size="sm">
                      {date}
                    </Badge>
                  ))}
                  {member.missedDates.length > 5 && (
                    <Badge variant="default" size="sm">
                      +{member.missedDates.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};