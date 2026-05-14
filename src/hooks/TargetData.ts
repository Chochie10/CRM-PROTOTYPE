import { useState, useEffect } from 'react';
import { useAuth } from '../auth/authContext';
import { useDataFilter } from './DataFilter';
import { MOCK_TARGETS } from '../data/mockTargets';
import type { MonthlyTarget } from '../types';

export const useTargetData = () => {
  const { user } = useAuth();
  const { filterTargetsByRole } = useDataFilter();
  const [targets, setTargets] = useState<MonthlyTarget[]>([]);
  const [filteredTargets, setFilteredTargets] = useState<MonthlyTarget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTargets(MOCK_TARGETS);
    setLoading(false);
  }, []);

  useEffect(() => {
    const filtered = filterTargetsByRole(targets);
    setFilteredTargets(filtered);
  }, [targets, user, filterTargetsByRole]);

  const getUserTargets = () => {
    if (!user) return [];
    return filteredTargets.filter(target => target.userId === user.id);
  };

  const getCenterTargets = () => {
    if (!user) return [];
    if (user.role === 'MANAGER' && user.centerId) {
      return filteredTargets.filter(target => target.centerId === user.centerId);
    }
    return filteredTargets;
  };

  const getTargetProgress = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    
    const currentTargets = filteredTargets.filter(
      t => t.month === currentMonth && t.year === currentYear
    );
    
    const totalTarget = currentTargets.reduce((sum, t) => sum + t.targetAmount, 0);
    const totalAchieved = currentTargets.reduce((sum, t) => sum + t.achievedAmount, 0);
    
    return {
      totalTarget,
      totalAchieved,
      progress: totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0,
    };
  };

  const submitTargetRevision = async (targetId: string, requestedAmount: number, reason: string) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Target revision submitted:', { targetId, requestedAmount, reason });
    return { success: true };
  };

  return {
    targets: filteredTargets,
    loading,
    getUserTargets,
    getCenterTargets,
    getTargetProgress,
    submitTargetRevision,
  };
};