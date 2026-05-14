import React from 'react';
import { useAuth } from '../../auth/authContext';
import { ApprovalList } from './ApprovalList';
import { RoleBasedWrapper } from '../../auth/RBWrapper';

const ApprovalContainer = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Role:</strong> Manager | <strong>Center:</strong> {user?.centerId?.replace('center_', '').toUpperCase()}
        </p>
        <p className="text-xs text-blue-600 mt-1">You can only approve/reject requests from your assigned center.</p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
        <p className="text-gray-500 mt-1">Review and approve target revisions from your team</p>
      </div>
      
      <RoleBasedWrapper allowedRoles={["MANAGER"]}>
        <ApprovalList />
      </RoleBasedWrapper>
    </div>
  );
};

export default ApprovalContainer;