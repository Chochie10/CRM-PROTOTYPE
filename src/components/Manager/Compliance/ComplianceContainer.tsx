import React from 'react';
import { useAuth } from '../../../auth/authContext';
import { RoleBasedWrapper } from '../../../auth/RBWrapper';
import { ComplianceTracker } from './ComplianceTracker';
import { SubmissionMonitor } from './SubmissionMonitor';
import { EscalationAlerts } from './EsxalationAlerts';
import { Card } from '../../common/Card';

const ComplianceContainer = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Role:</strong> Manager | <strong>Center:</strong> {user?.centerId?.replace('center_', '').toUpperCase()}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Monitor team compliance, submission rates, and receive escalation alerts.
        </p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Monitoring</h1>
        <p className="text-gray-500 mt-1">
          Track submission compliance and manage escalation alerts for your team
        </p>
      </div>

      <RoleBasedWrapper allowedRoles={["MANAGER"]}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComplianceTracker />
          <SubmissionMonitor />
        </div>
        
        <div className="mt-6">
          <EscalationAlerts />
        </div>
      </RoleBasedWrapper>
    </div>
  );
};

export default ComplianceContainer;