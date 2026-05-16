import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/authContext';
import { Card } from '../../common/Card';
import { Select } from '../../common/Select';
import { Badge } from '../../common/Badge';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar } from 'lucide-react';
import { MOCK_USERS } from '../../../data/mockUsers';
import { MOCK_DAILY_SALES } from '../../../data/mockSales';
import { MOCK_TARGETS } from '../../../data/mockTargets';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export const ManagerAnalytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [salesData, setSalesData] = useState<any[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [productDistribution, setProductDistribution] = useState<any[]>([]);
  const [weeklyComparison, setWeeklyComparison] = useState<any[]>([]);

  useEffect(() => {
    if (user?.centerId) {
      // Filter data for manager's center
      const centerSales = MOCK_DAILY_SALES.filter(sale => sale.centerId === user.centerId);
      const teamMembers = MOCK_USERS.filter(u => u.centerId === user.centerId && u.role === 'SALESPERSON');
      
      // Sales trend data
      let days = 30;
      if (timeRange === 'week') days = 7;
      if (timeRange === 'quarter') days = 90;
      if (timeRange === 'year') days = 365;
      
      const trend = [];
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dailySales = centerSales
          .filter(sale => sale.date === dateStr)
          .reduce((sum, sale) => sum + sale.amount, 0);
        trend.push({ date: dateStr, sales: dailySales });
      }
      setTrendData(trend);
      
      // Team performance data
      const performance = teamMembers.map(member => {
        const memberSales = centerSales.filter(sale => sale.userId === member.id);
        const totalSales = memberSales.reduce((sum, sale) => sum + sale.amount, 0);
        const avgDaily = totalSales / (memberSales.length || 1);
        const targets = MOCK_TARGETS.filter(t => t.userId === member.id);
        const currentTarget = targets.find(t => t.month === new Date().toLocaleString('default', { month: 'long' }));
        
        return {
          name: member.name,
          sales: totalSales,
          target: currentTarget?.targetAmount || 0,
          avgDaily,
          submissions: memberSales.length,
          achievement: currentTarget?.targetAmount ? (totalSales / currentTarget.targetAmount) * 100 : 0,
        };
      }).sort((a, b) => b.sales - a.sales);
      setTeamPerformance(performance);
      
      // Weekly comparison data
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const weeklyData = weeks.map((week, idx) => {
        const weekSales = centerSales.filter(sale => {
          const weekNum = Math.ceil(new Date(sale.date).getDate() / 7);
          return weekNum === idx + 1;
        });
        return {
          week,
          sales: weekSales.reduce((sum, sale) => sum + sale.amount, 0),
          target: 5000000, // Example target
        };
      });
      setWeeklyComparison(weeklyData);
      
      // Product distribution
      const products: Record<string, number> = {};
      centerSales.forEach(sale => {
        sale.products.forEach(product => {
          products[product.productName] = (products[product.productName] || 0) + product.total;
        });
      });
      const productDist = Object.entries(products).map(([name, value]) => ({
        name: name.split(' ')[0],
        value,
      }));
      setProductDistribution(productDist);
      
      // Monthly sales data
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString('default', { month: 'short' });
        const monthSales = centerSales.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate.getMonth() === date.getMonth() && saleDate.getFullYear() === date.getFullYear();
        });
        monthlyData.push({
          month: monthName,
          sales: monthSales.reduce((sum, sale) => sum + sale.amount, 0),
        });
      }
      setSalesData(monthlyData);
    }
  }, [user, timeRange]);

  const totalSales = teamPerformance.reduce((sum, m) => sum + m.sales, 0);
  const totalTarget = teamPerformance.reduce((sum, m) => sum + m.target, 0);
  const overallAchievement = totalTarget > 0 ? (totalSales / totalTarget) * 100 : 0;
  const avgTeamPerformance = teamPerformance.reduce((sum, m) => sum + m.achievement, 0) / (teamPerformance.length || 1);
  
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const timeRangeOptions = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 90 Days' },
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₱{(totalSales / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-green-600 mt-1">↑ 12.5% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Team Size</p>
              <p className="text-2xl font-bold text-gray-900">{teamPerformance.length}</p>
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
              <p className="text-sm text-gray-500">Target Achievement</p>
              <p className="text-2xl font-bold text-gray-900">{overallAchievement.toFixed(1)}%</p>
              <p className="text-xs text-yellow-600 mt-1">Avg: {avgTeamPerformance.toFixed(0)}% per member</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 rounded-full h-2 transition-all"
                style={{ width: `${Math.min(overallAchievement, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Submission Rate</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
              <p className="text-xs text-green-600 mt-1">↑ 3% this month</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card title="Sales Trend">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `₱${value/1000}K`} />
              <Tooltip formatter={(value: any) => [`₱${value.toLocaleString()}`, "Sales"]} />
              <Area type="monotone" dataKey="sales" stroke="#3B82F6" fill="#93C5FD" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly Comparison */}
        <Card title="Weekly Performance Comparison">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis tickFormatter={(value) => `₱${value/1000}K`} />
              <Tooltip formatter={(value: any) => [`₱${value.toLocaleString()}`, ""]} />
              <Bar dataKey="sales" fill="#3B82F6" name="Actual Sales" />
              <Bar dataKey="target" fill="#93C5FD" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Performance */}
        <Card title="Monthly Performance">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₱${value/1000}K`} />
              <Tooltip formatter={(value: any) => [`₱${value.toLocaleString()}`, "Sales"]} />
              <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Product Distribution */}
        <Card title="Product Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={(entry) => entry.name}
              >
                {productDistribution.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`₱${(value / 1000).toFixed(0)}K`, "Revenue"]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card title="Team Performance Details">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Salesperson</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Total Sales</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Target</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Achievement</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Avg Daily</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teamPerformance.map((member, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">₱{(member.sales / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-sm text-gray-500">₱{(member.target / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${Math.min(member.achievement, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{member.achievement.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">₱{(member.avgDaily / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3">
                    <Badge variant={member.achievement >= 80 ? 'success' : member.achievement >= 60 ? 'warning' : 'danger'} size="sm">
                      {member.achievement >= 80 ? 'On Track' : member.achievement >= 60 ? 'At Risk' : 'Behind'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <p className="text-sm text-gray-500">Top Performer</p>
            <p className="text-lg font-semibold text-gray-900">{teamPerformance[0]?.name || 'N/A'}</p>
            <p className="text-xs text-green-600 mt-1">
              {teamPerformance[0]?.achievement.toFixed(0)}% to target
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="text-yellow-600" size={24} />
            </div>
            <p className="text-sm text-gray-500">Needs Improvement</p>
            <p className="text-lg font-semibold text-gray-900">{teamPerformance[teamPerformance.length - 1]?.name || 'N/A'}</p>
            <p className="text-xs text-red-600 mt-1">
              {teamPerformance[teamPerformance.length - 1]?.achievement.toFixed(0)}% to target
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <p className="text-sm text-gray-500">Average Performance</p>
            <p className="text-lg font-semibold text-gray-900">{avgTeamPerformance.toFixed(0)}%</p>
            <p className="text-xs text-gray-500 mt-1">Team average achievement</p>
          </div>
        </Card>
      </div>
    </div>
  );
};