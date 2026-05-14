import React, { useState } from 'react';
import { useAuth } from '../../auth/authContext';
import { useSalesData } from '../../hooks/SalesData';
import { useTargetData } from '../../hooks/TargetData';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import { TrendingUp, Building2, DollarSign, Trophy } from 'lucide-react';
import { MOCK_CENTERS } from '../../data/mockCenters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const ExecomDashboard = () => {
  const { user } = useAuth();
  const { getTotalSales, getSalesByCenter, getSalesTrend, selectedCenter, setSelectedCenter, canViewAllCenters } = useSalesData();
  const { getTargetProgress } = useTargetData();

  const totalRevenue = getTotalSales();
  const salesByCenter = getSalesByCenter();
  const salesTrend = getSalesTrend(30);
  const { totalTarget, progress } = getTargetProgress();

  const centerOptions = [
    { value: 'all', label: 'All Centers' },
    ...MOCK_CENTERS.map(center => ({ value: center.id, label: center.name }))
  ];

  const centerPerformance = MOCK_CENTERS.map(center => {
    const centerSales = salesByCenter.find(s => s.centerId === center.id);
    return {
      name: center.name.split(' ')[1],
      revenue: (centerSales?.totalSales || 0) / 1000000,
      target: center.annualTarget / 1000000,
      progress: center.currentSales / center.annualTarget * 100,
    };
  });

  const revenueByCenter = MOCK_CENTERS.map(center => ({
    name: center.name.split(' ')[1],
    value: center.currentSales,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  }));

  const monthlyTrend = [
    { month: "Jan", revenue: 12.5, target: 15 },
    { month: "Feb", revenue: 14.2, target: 15 },
    { month: "Mar", revenue: 16.8, target: 18 },
    { month: "Apr", revenue: 18.5, target: 18 },
    { month: "May", revenue: 20.1, target: 20 },
    { month: "Jun", revenue: 22.3, target: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded flex justify-between items-center">
        <div>
          <p className="text-sm text-purple-800">
            <strong>Role:</strong> Executive Committee
          </p>
          <p className="text-xs text-purple-600 mt-1">You have organization-wide visibility across all centers</p>
        </div>
        {canViewAllCenters && (
          <div className="w-64">
            <Select
              options={centerOptions}
              value={selectedCenter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCenter(e.target.value)}
            />
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enterprise Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Organization-wide performance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">₱{(totalRevenue / 1000000).toFixed(0)}M</p>
              <p className="text-xs text-green-600 mt-1">↑ 15.3% vs last year</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Annual Target</p>
              <p className="text-2xl font-bold text-gray-900">₱{(totalTarget / 1000000).toFixed(0)}M</p>
              <p className="text-xs text-gray-500 mt-1">Overall company goal</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 rounded-full h-2 transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Centers</p>
              <p className="text-2xl font-bold text-gray-900">{MOCK_CENTERS.length}</p>
              <p className="text-xs text-green-600 mt-1">All regions active</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Top Center</p>
              <p className="text-2xl font-bold text-gray-900">
                {centerPerformance.reduce((max, c) => c.revenue > max.revenue ? c : max).name}
              </p>
              <p className="text-xs text-green-600 mt-1">Leading performer</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Trophy className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Center Performance Comparison">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={centerPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₱${value}M`} />
              <Tooltip formatter={(value: any) => [`₱${value}M`, ""]} />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
              <Bar dataKey="target" fill="#93C5FD" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue Distribution by Center">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={revenueByCenter}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={(entry) => entry.name}
              >
                {revenueByCenter.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`₱${(value / 1000000).toFixed(1)}M`, "Revenue"]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Sales Trend Overview">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `₱${value/1000}K`} />
            <Tooltip formatter={(value: any) => [`₱${value.toLocaleString()}`, "Sales"]} />
            <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {centerPerformance.map((center, idx) => (
          <Card key={idx} title={center.name}>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Revenue</span>
                <span className="font-semibold">₱{center.revenue.toFixed(1)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Target</span>
                <span className="font-semibold">₱{center.target.toFixed(1)}M</span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{center.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2 transition-all"
                    style={{ width: `${Math.min(center.progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExecomDashboard;