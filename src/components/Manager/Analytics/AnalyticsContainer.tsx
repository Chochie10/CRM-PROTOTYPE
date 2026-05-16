import React from 'react';
import { useAuth } from '../../../auth/authContext';
import { RoleBasedWrapper } from '../../../auth/RBWrapper';
import { ManagerAnalytics } from './ManagerAnalytics';
import { ExecomAnalytics } from './ExecomAnalytics';

const AnalyticsContainer = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Role:</strong> {user.role} | 
          {user.role === 'MANAGER' && ` Center: ${user.centerId?.replace('center_', '').toUpperCase()}`}
          {user.role === 'EXECOM' && ' Organization-wide visibility'}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          View performance analytics, trends, and insights for {user.role === 'MANAGER' ? 'your center' : 'the entire organization'}.
        </p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {user.role === 'MANAGER' 
            ? 'Center performance metrics and team analytics' 
            : 'Enterprise-wide analytics and strategic insights'}
        </p>
      </div>

      <RoleBasedWrapper allowedRoles={["MANAGER", "EXECOM"]}>
        {user.role === 'MANAGER' && <ManagerAnalytics />}
        {user.role === 'EXECOM' && <ExecomAnalytics />}
      </RoleBasedWrapper>
    </div>
  );
};

export default AnalyticsContainer;