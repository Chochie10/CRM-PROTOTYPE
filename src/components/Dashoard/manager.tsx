import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/authContext';
import { useSalesData } from '../../hooks/SalesData';
import { useTargetData } from '../../hooks/TargetData';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Users, DollarSign, Target, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { MOCK_USERS } from '../../data/mockUsers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { getCenterSales, getSalesTrend, getTotalSales } = useSalesData();
  const { getCenterTargets, getTargetProgress } = useTargetData();

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  useEffect(() => {
    if (user?.centerId) {
      const team = MOCK_USERS.filter(u => u.centerId === user.centerId && u.role === "SALESPERSON");
      setTeamMembers(team);
    }
  }, [user]);

  const centerSales = getCenterSales();
  const totalSales = getTotalSales();
  const salesTrend = getSalesTrend(30);
  const { totalTarget, totalAchieved, progress } = getTargetProgress();

  const centerName = user?.centerId?.replace('center_', '').toUpperCase() || 'Unknown';
  const teamSize = teamMembers.length;
  const pendingApprovals = 5;
  const lateSubmissions = 3;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Role:</strong> Manager | <strong>Center:</strong> {centerName}
        </p>
        <p className="text-xs text-blue-600 mt-1">You can only view data for your assigned center: {centerName}</p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{centerName} Center Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor your team's performance and compliance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Center Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₱{(totalSales / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500 mt-1">Target: ₱{(totalTarget / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2 transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Team Size</p>
              <p className="text-2xl font-bold text-gray-900">{teamSize}</p>
              <p className="text-xs text-green-600 mt-1">Active salespersons</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingApprovals}</p>
              <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Late Submissions</p>
              <p className="text-2xl font-bold text-red-600">{lateSubmissions}</p>
              <p className="text-xs text-red-600 mt-1">Non-compliant</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Center Sales Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `₱${value/1000}K`} />
              <Tooltip formatter={(value: any) => [`₱${value.toLocaleString()}`, "Sales"]} />
              <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Team Performance">
          <div className="space-y-3">
            {teamMembers.map((member, idx) => {
              const memberSales = centerSales.filter(s => s.userId === member.id);
              const totalMemberSales = memberSales.reduce((sum, s) => sum + s.amount, 0);
              const avgDaily = totalMemberSales / 30;
              
              return (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">Total: ₱{(totalMemberSales / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                  <Badge variant={idx < 3 ? "success" : "default"}>
                    ₱{(avgDaily / 1000).toFixed(0)}K/day
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;