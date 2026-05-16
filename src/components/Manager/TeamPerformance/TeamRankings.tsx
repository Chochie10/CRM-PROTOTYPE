import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/authContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { MOCK_USERS } from '../../../data/mockUsers';
import { MOCK_DAILY_SALES } from '../../../data/mockSales';

export const TeamRankings = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    if (user?.centerId) {
      const team = MOCK_USERS.filter(u => u.centerId === user.centerId && u.role === "SALESPERSON");
      const teamWithSales = team.map(member => {
        const memberSales = MOCK_DAILY_SALES.filter(sale => sale.userId === member.id);
        const totalSales = memberSales.reduce((sum, sale) => sum + sale.amount, 0);
        const avgDaily = totalSales / 30;
        return { ...member, totalSales, avgDaily };
      }).sort((a, b) => b.totalSales - a.totalSales);
      setTeamMembers(teamWithSales);
    }
  }, [user]);

  return (
    <Card title="Team Rankings">
      <div className="space-y-3">
        {teamMembers.map((member, idx) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                {idx + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">Total: ₱{(member.totalSales / 1000000).toFixed(1)}M</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">₱{(member.avgDaily / 1000).toFixed(0)}K/day</p>
              <Badge variant={idx < 3 ? "success" : "default"} size="sm">
                #{idx + 1}
              </Badge>
            </div>
          </div>
        ))}
        {teamMembers.length === 0 && (
          <p className="text-center text-gray-500 py-4">No team members found</p>
        )}
      </div>
    </Card>
  );
};