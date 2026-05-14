import React from 'react';
import { useAuth } from '../../auth/authContext';
import { Card } from '../common/Card';
import { SalesSubmissionForm } from './SalesSubmissionForm';
import { SalesHistory } from './SalesHistory';
import { RoleBasedWrapper } from '../../auth/RBWrapper';

const DailySalesContainer = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Role:</strong> Salesperson | <strong>Center:</strong> {user?.centerId?.replace('center_', '').toUpperCase()}
        </p>
        <p className="text-xs text-blue-600 mt-1">You can only submit and view your own sales records.</p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daily Sales</h1>
        <p className="text-gray-500 mt-1">Submit and track your daily sales</p>
      </div>
      
      <RoleBasedWrapper allowedRoles={["SALESPERSON"]}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesSubmissionForm />
          <SalesHistory />
        </div>
      </RoleBasedWrapper>
    </div>
  );
};

export default DailySalesContainer;