import React, { useState, useEffect } from 'react';
import { Card } from '../../common/Card';
import { Select } from '../../common/Select';
import { Badge } from '../../common/Badge';
import { TrendingUp, DollarSign, Building2, Trophy, Target } from 'lucide-react';
import { MOCK_CENTERS } from '../../../data/mockCenters';
import { MOCK_DAILY_SALES } from '../../../data/mockSales';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

export const ExecomAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [centerComparison, setCenterComparison] = useState<any[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [marketShare, setMarketShare] = useState<any[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<any[]>([]);

  useEffect(() => {
    // Center comparison data
    const comparison = MOCK_CENTERS.map(center => {
      const centerSales = MOCK_DAILY_SALES.filter(sale => sale.centerId === center.id);
      const totalRevenue = centerSales.reduce((sum, sale) => sum + sale.amount, 0);
      const growth = ((center.currentSales - center.annualTarget * 0.5) / (center.annualTarget * 0.5)) * 100;
      
      return {
        name: center.name.split(' ')[1],
        revenue: totalRevenue,
        target: center.annualTarget,
        growth: growth,
        achievement: (center.currentSales / center.annualTarget) * 100,
      };
    });
    setCenterComparison(comparison);
    
    // Revenue trend
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthSales = MOCK_DAILY_SALES.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === date.getMonth() && saleDate.getFullYear() === date.getFullYear();
      });
      trend.push({
        month: monthName,
        revenue: monthSales.reduce((sum, sale) => sum + sale.amount, 0),
      });
    }
    setRevenueTrend(trend);
    
    // Market share
    const totalRevenue = comparison.reduce((sum, c) => sum + c.revenue, 0);
    const share = comparison.map(c => ({
      name: c.name,
      value: c.revenue,
      percentage: (c.revenue / totalRevenue) * 100,
    }));
    setMarketShare(share);
    
    // Growth metrics
    const metrics = comparison.map(c => ({
      name: c.name,
      growth: c.growth,
      achievement: c.achievement,
    }));
    setGrowthMetrics(metrics);
  }, [timeRange]);

  const totalRevenue = centerComparison.reduce((sum, c) => sum + c.revenue, 0);
  const avgGrowth = centerComparison.reduce((sum, c) => sum + c.growth, 0) / centerComparison.length;
  const topPerformer = centerComparison.reduce((max, c) => c.growth > max.growth ? c : max, centerComparison[0]);
  
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  const timeRangeOptions = [
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex justify-end">
        <div className="w-48">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          />
        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₱{(totalRevenue / 1000000).toFixed(0)}M</p>
              <p className="text-xs text-green-600 mt-1">↑ 15.3% YoY</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Centers</p>
              <p className="text-2xl font-bold text-gray-900">{centerComparison.length}</p>
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
              <p className="text-sm text-gray-500">Avg Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">{avgGrowth.toFixed(1)}%</p>
              <p className="text-xs text-green-600 mt-1">↑ 5.2% from last year</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Top Center</p>
              <p className="text-2xl font-bold text-gray-900">{topPerformer?.name}</p>
              <p className="text-xs text-green-600 mt-1">↑ {topPerformer?.growth?.toFixed(1)}% growth</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Trophy className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Center Performance Comparison */}
        <Card title="Center Performance Comparison">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={centerComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" tickFormatter={(value) => `₱${value/1000000}M`} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
              <Tooltip
  formatter={(value: any, name: any): [string | number, string] => {
    if (name === "revenue") {
      return [`₱${(value / 1000000).toFixed(1)}M`, "Revenue"];
    }

    if (name === "growth") {
      return [`${value.toFixed(1)}%`, "Growth"];
    }

    return [value, name];
  }}
/>
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue" />
              <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#10B981" strokeWidth={2} name="Growth %" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Trend */}
        <Card title="Revenue Trend">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₱${value/1000000}M`} />
              <Tooltip formatter={(value: any) => [`₱${(value / 1000000).toFixed(1)}M`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Market Share Distribution */}
        <Card title="Market Share by Center">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={marketShare}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percentage }: any) =>
  `${name} (${percentage.toFixed(1)}%)`
}
              >
                {marketShare.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`₱${(value / 1000000).toFixed(1)}M`, "Revenue"]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Growth & Achievement Matrix */}
        <Card title="Growth & Achievement Matrix">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={growthMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" tickFormatter={(value) => `${value}%`} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="growth" fill="#F59E0B" name="Growth Rate" />
              <Bar yAxisId="right" dataKey="achievement" fill="#3B82F6" name="Target Achievement" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Center Performance Details Table */}
      <Card title="Center Performance Details">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Center</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Target</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Achievement</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Growth</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {centerComparison.map((center, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{center.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">₱{(center.revenue / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-sm text-gray-500">₱{(center.target / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${Math.min(center.achievement, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{center.achievement.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${center.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {center.growth >= 0 ? '+' : ''}{center.growth.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={center.achievement >= 80 ? 'success' : center.achievement >= 60 ? 'warning' : 'danger'} size="sm">
                      {center.achievement >= 80 ? 'Excellent' : center.achievement >= 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Strategic Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Strategic Insights">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="text-green-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">Growth Opportunities</p>
                <p className="text-xs text-gray-600">
                  {topPerformer?.name} shows strongest growth at {topPerformer?.growth?.toFixed(1)}%. 
                  Consider replicating their strategies across other centers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Target className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">Target Achievement</p>
                <p className="text-xs text-gray-600">
                  Overall target achievement is {centerComparison.reduce((sum, c) => sum + c.achievement, 0) / centerComparison.length}%. 
                  Focus on underperforming centers to improve.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Recommendations">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Building2 className="text-blue-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">Resource Allocation</p>
                <p className="text-xs text-gray-600">
                  Consider allocating additional resources to centers with high growth potential.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="text-purple-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">Performance Review</p>
                <p className="text-xs text-gray-600">
                  Schedule performance reviews with underperforming centers to identify improvement areas.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};