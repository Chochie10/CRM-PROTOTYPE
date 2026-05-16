import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/authContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Download, Printer, Eye } from 'lucide-react';
import { MOCK_DAILY_SALES } from '../../data/mockSales';
import { MOCK_TARGETS } from '../../data/mockTargets';
import { MOCK_USERS } from '../../data/mockUsers';
import { MOCK_CENTERS } from '../../data/mockCenters';

interface ReportPreviewProps {
  reportType: string;
  dateRange: string;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ reportType, dateRange }) => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      generateReport();
      setLoading(false);
    }, 500);
  }, [reportType, dateRange, user]);

  const generateReport = () => {
    if (!user) return;

    const getDateRangeDays = () => {
      switch (dateRange) {
        case 'week': return 7;
        case 'month': return 30;
        case 'quarter': return 90;
        case 'year': return 365;
        default: return 30;
      }
    };

    const days = getDateRangeDays();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Filter sales based on user role
    let filteredSales = MOCK_DAILY_SALES;
    
    if (user.role === 'SALESPERSON') {
      filteredSales = filteredSales.filter(s => s.userId === user.id);
    } else if (user.role === 'MANAGER' && user.centerId) {
      filteredSales = filteredSales.filter(s => s.centerId === user.centerId);
    }

    // Filter by date range
    filteredSales = filteredSales.filter(s => new Date(s.date) >= startDate);

    const totalSales = filteredSales.reduce((sum, s) => sum + s.amount, 0);
    const averageDaily = totalSales / days;
    const totalTransactions = filteredSales.length;

    // Group sales by center
    const salesByCenter = MOCK_CENTERS.map(center => ({
      center: center.name,
      sales: filteredSales.filter(s => s.centerId === center.id).reduce((sum, s) => sum + s.amount, 0),
    })).filter(c => c.sales > 0);

    // Get targets
    let filteredTargets = MOCK_TARGETS;
    if (user.role === 'SALESPERSON') {
      filteredTargets = filteredTargets.filter(t => t.userId === user.id);
    } else if (user.role === 'MANAGER' && user.centerId) {
      filteredTargets = filteredTargets.filter(t => t.centerId === user.centerId);
    }

    const targetAchievement = filteredTargets.reduce((sum, t) => sum + t.achievedAmount, 0) / 
                              filteredTargets.reduce((sum, t) => sum + t.targetAmount, 0) * 100;

    setReportData({
      generatedDate: new Date().toLocaleString(),
      reportType,
      dateRange,
      userRole: user.role,
      userName: user.name,
      centerName: user.centerId ? MOCK_CENTERS.find(c => c.id === user.centerId)?.name : 'All Centers',
      summary: {
        totalSales,
        averageDaily,
        totalTransactions,
        targetAchievement: isNaN(targetAchievement) ? 0 : targetAchievement,
      },
      salesByCenter,
      recentTransactions: filteredSales.slice(-10).reverse(),
      topPerformers: MOCK_USERS.filter(u => u.role === 'SALESPERSON')
        .map(u => ({
          name: u.name,
          sales: filteredSales.filter(s => s.userId === u.id).reduce((sum, s) => sum + s.amount, 0),
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5),
    });
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Generating report...</p>
        </div>
      </Card>
    );
  }

  if (!reportData) return null;

  return (
    <Card title="Report Preview">
      {/* Report Header */}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {reportType === 'individual' && 'Individual Performance Report'}
              {reportType === 'center' && 'Center Summary Report'}
              {reportType === 'executive' && 'Executive Report'}
              {reportType === 'compliance' && 'Compliance Report'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Generated for: {reportData.userName} | {reportData.userRole}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Date Range: {reportData.dateRange.toUpperCase()} | Generated: {reportData.generatedDate}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Printer size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-xs text-gray-500">Total Sales</p>
          <p className="text-xl font-bold text-gray-900">₱{(reportData.summary.totalSales / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-xs text-gray-500">Average Daily</p>
          <p className="text-xl font-bold text-gray-900">₱{(reportData.summary.averageDaily / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-xs text-gray-500">Transactions</p>
          <p className="text-xl font-bold text-gray-900">{reportData.summary.totalTransactions}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-xs text-gray-500">Target Achievement</p>
          <p className="text-xl font-bold text-yellow-600">{reportData.summary.targetAchievement.toFixed(1)}%</p>
        </div>
      </div>

      {/* Sales by Center */}
      {reportData.salesByCenter.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Sales by Center</h3>
          <div className="space-y-2">
            {reportData.salesByCenter.map((center: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{center.center}</span>
                <span className="text-sm font-semibold text-gray-900">₱{(center.sales / 1000000).toFixed(2)}M</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData.recentTransactions.map((transaction: any, idx: number) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">₱{(transaction.amount / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-2">
                    <Badge variant={transaction.status === 'APPROVED' ? 'success' : 'warning'} size="sm">
                      {transaction.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers */}
      {reportData.topPerformers.length > 0 && (user?.role === 'MANAGER' || user?.role === 'EXECOM' || user?.role === 'ADMIN') && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Top Performers</h3>
          <div className="space-y-2">
            {reportData.topPerformers.map((performer: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-500">#{idx + 1}</span>
                  <span className="text-sm text-gray-700">{performer.name}</span>
                </div>
                <span className="text-sm font-semibold text-green-600">₱{(performer.sales / 1000000).toFixed(2)}M</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};