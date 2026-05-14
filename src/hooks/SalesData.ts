import { useState, useEffect } from 'react';
import { useAuth } from '../auth/authContext';
import { useDataFilter } from './DataFilter';
import { MOCK_DAILY_SALES } from '../data/mockSales';
import type { DailySale } from '../types';

export const useSalesData = () => {
  const { user } = useAuth();
  const { filterSalesByRole, getUserCenters } = useDataFilter();
  const [sales, setSales] = useState<DailySale[]>([]);
  const [filteredSales, setFilteredSales] = useState<DailySale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<string>('all');

  useEffect(() => {
    // Load all sales
    setSales(MOCK_DAILY_SALES);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Apply role-based filtering
    let filtered = filterSalesByRole(sales);
    
    // Apply center filter (for Execom/Admin)
    if (selectedCenter !== 'all' && (user?.role === 'EXECOM' || user?.role === 'ADMIN')) {
      filtered = filtered.filter(sale => sale.centerId === selectedCenter);
    }
    
    setFilteredSales(filtered);
  }, [sales, user, filterSalesByRole, selectedCenter]);

  const getUserSales = () => {
    if (!user) return [];
    return filteredSales.filter(sale => sale.userId === user.id);
  };

  const getCenterSales = () => {
    if (!user) return [];
    if (user.role === 'MANAGER' && user.centerId) {
      return filteredSales.filter(sale => sale.centerId === user.centerId);
    }
    if (user.role === 'EXECOM' || user.role === 'ADMIN') {
      if (selectedCenter !== 'all') {
        return filteredSales.filter(sale => sale.centerId === selectedCenter);
      }
      return filteredSales;
    }
    return [];
  };

  const getTotalSales = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
  };

  const getSalesByCenter = () => {
    const centers = getUserCenters();
    return centers.map(centerId => ({
      centerId,
      totalSales: filteredSales
        .filter(sale => sale.centerId === centerId)
        .reduce((sum, sale) => sum + sale.amount, 0),
      count: filteredSales.filter(sale => sale.centerId === centerId).length,
    }));
  };

  const getSalesTrend = (days: number = 30) => {
    const trend = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dailySales = filteredSales
        .filter(sale => sale.date === dateStr)
        .reduce((sum, sale) => sum + sale.amount, 0);
      trend.push({ date: dateStr, amount: dailySales });
    }
    return trend;
  };

  return {
    sales: filteredSales,
    loading,
    selectedCenter,
    setSelectedCenter,
    getUserSales,
    getCenterSales,
    getTotalSales,
    getSalesByCenter,
    getSalesTrend,
    canViewAllCenters: user?.role === 'EXECOM' || user?.role === 'ADMIN',
    userRole: user?.role,
  };
};