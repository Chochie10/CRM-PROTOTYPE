import React from 'react';
import { useAuth } from '../../auth/authContext';
import { useSalesData } from '../../hooks/SalesData';
import { useTargetData } from '../../hooks/TargetData';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { DollarSign, Target, TrendingUp, Calendar, CheckCircle, Trophy } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const SalespersonDashboard = () => {
  const { user } = useAuth();
  const { getUserSales, getTotalSales, getSalesTrend } = useSalesData();
  const { getUserTargets, getTargetProgress } = useTargetData();

  const userSales = getUserSales();
  const userTargets = getUserTargets();
  const totalSales = getTotalSales();
  const { progress } = getTargetProgress();
  const salesTrend = getSalesTrend(30);

  const currentTarget = userTargets.find(
    t => t.month === new Date().toLocaleString('default', { month: 'long' })
  );

  const recentSales = userSales.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Role:</strong> Salesperson | <strong>Center:</strong> {user?.centerId?.replace('center_', '').toUpperCase()}
        </p>
        <p className="text-xs text-blue-600 mt-1">You can only view and manage your own data.</p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Performance Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">My Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">₱{(totalSales / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-green-600 mt-1">↑ 12.5% vs last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Target</p>
              <p className="text-2xl font-bold text-gray-900">₱{((currentTarget?.targetAmount || 0) / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500 mt-1">Progress: {progress.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 rounded-full h-2 transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Submission Rate</p>
              <p className="text-2xl font-bold text-gray-900">96%</p>
              <p className="text-xs text-green-600 mt-1">↑ 3% this month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-yellow-600 mt-1">This quarter</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Trophy className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="My Sales Trend (Last 30 Days)">
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

        <Card title="Recent Sales">
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{sale.date}</p>
                  <p className="text-xs text-gray-500">{sale.products?.length || 0} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₱{(sale.amount / 1000).toFixed(0)}K</p>
                  <Badge variant={sale.status === "APPROVED" ? "success" : "warning"} size="sm">
                    {sale.status}
                  </Badge>
                </div>
              </div>
            ))}
            {recentSales.length === 0 && (
              <p className="text-center text-gray-500 py-4">No sales records found</p>
            )}
          </div>
        </Card>
      </div>

      <Card title="Monthly Target Performance">
        <div className="space-y-4">
          {userTargets.slice(0, 6).map((target) => (
            <div key={target.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{target.month} {target.year}</p>
                <p className="text-sm text-gray-500">Target: ₱{(target.targetAmount / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Achieved: ₱{(target.achievedAmount / 1000).toFixed(0)}K</p>
                <Badge variant={
                  target.status === "APPROVED" ? "success" : 
                  target.status === "PENDING" ? "warning" : "default"
                } size="sm">
                  {target.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SalespersonDashboard;