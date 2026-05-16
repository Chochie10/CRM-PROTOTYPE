import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/authContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { MOCK_USERS } from '../../../data/mockUsers';
import { MOCK_DAILY_SALES } from '../../../data/mockSales';

export const ComplianceTracker = () => {
  const { user } = useAuth();
  const [complianceData, setComplianceData] = useState<any[]>([]);

  useEffect(() => {
    if (user?.centerId) {
      const team = MOCK_USERS.filter(u => u.centerId === user.centerId && u.role === "SALESPERSON");
      const compliance = team.map(member => {
        const memberSales = MOCK_DAILY_SALES.filter(sale => sale.userId === member.id);
        const expectedSubmissions = 30; // 30 days in a month
        const actualSubmissions = memberSales.length;
        const rate = (actualSubmissions / expectedSubmissions) * 100;
        
        let status = 'Good';
        if (rate < 70) status = 'Critical';
        else if (rate < 90) status = 'Warning';
        
        return {
          name: member.name,
          rate: rate,
          status: status,
        };
      });
      setComplianceData(compliance);
    }
  }, [user]);

  return (
    <Card title="Compliance Tracker">
      <div className="space-y-3">
        {complianceData.map((member) => (
          <div key={member.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500">Submission Rate</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`rounded-full h-2 ${
                      member.rate >= 90 ? 'bg-green-500' : 
                      member.rate >= 70 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(member.rate, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{member.rate.toFixed(0)}%</span>
              </div>
              <Badge 
                variant={
                  member.status === 'Good' ? 'success' : 
                  member.status === 'Warning' ? 'warning' : 
                  'danger'
                } 
                size="sm"
              >
                {member.status}
              </Badge>
            </div>
          </div>
        ))}
        {complianceData.length === 0 && (
          <p className="text-center text-gray-500 py-4">No compliance data found</p>
        )}
      </div>
    </Card>
  );
};