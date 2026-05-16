import React from 'react';
import { useAuth } from '../../../auth/authContext';
import { Card } from '../../common/Card';
import { TeamRankings } from './TeamRankings';
import { ComplianceTracker } from './ComplianceTracker';
import { RoleBasedWrapper } from '../../../auth/RBWrapper';

const TeamPerformanceContainer = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Role:</strong> Manager | <strong>Center:</strong> {user?.centerId?.replace('center_', '').toUpperCase()}
        </p>
        <p className="text-xs text-blue-600 mt-1">You can only view performance data for your assigned center.</p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Performance</h1>
        <p className="text-gray-500 mt-1">Monitor your team's sales performance and compliance</p>
      </div>
      
      <RoleBasedWrapper allowedRoles={["MANAGER"]}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamRankings />
          <ComplianceTracker />
        </div>
      </RoleBasedWrapper>
    </div>
  );
};

export default TeamPerformanceContainer;