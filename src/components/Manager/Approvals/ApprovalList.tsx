import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/authContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { ApprovalActions } from './ApprovalAction';
import { AlertCircle, Clock } from 'lucide-react';
import { MOCK_TARGETS } from '../../../data/mockTargets';
import { MOCK_USERS } from '../../../data/mockUsers';

export const ApprovalList = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {
    if (user?.centerId && user?.role === 'MANAGER') {
      // Get all targets from salespersons in this manager's center that are pending approval
      const teamMembers = MOCK_USERS.filter(u => u.centerId === user.centerId && u.role === 'SALESPERSON');
      const teamIds = teamMembers.map(m => m.id);
      
      const pendingTargets = MOCK_TARGETS.filter(target => 
        teamIds.includes(target.userId) && 
        target.status === 'PENDING'
      );
      
      const formattedApprovals = pendingTargets.map(target => {
        const salesperson = MOCK_USERS.find(u => u.id === target.userId);
        return {
          id: target.id,
          salespersonId: target.userId,
          salespersonName: salesperson?.name || 'Unknown',
          currentTarget: target.targetAmount,
          requestedTarget: target.revisionRequest?.requestedAmount || target.targetAmount,
          reason: target.revisionRequest?.reason || 'Monthly target submission',
          status: 'pending',
          month: target.month,
          year: target.year,
          requestedAt: target.revisionRequest?.requestedAt || new Date().toISOString(),
        };
      });
      
      setApprovals(formattedApprovals);
    }
  }, [user]);

  const handleApprove = async (id: string, comments?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Approved request ${id} with comments: ${comments}`);
    alert(`✅ Request approved successfully!\nComments: ${comments || 'None'}`);
    setApprovals(approvals.filter(a => a.id !== id));
  };

  const handleReject = async (id: string, comments?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Rejected request ${id} with reason: ${comments}`);
    alert(`❌ Request rejected.\nReason: ${comments || 'No reason provided'}`);
    setApprovals(approvals.filter(a => a.id !== id));
  };

  if (approvals.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Approvals</h3>
          <p className="text-gray-500">All target requests have been reviewed.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={`Pending Approvals (${approvals.length})`}>
      <div className="space-y-4">
        {approvals.map((approval) => (
          <div key={approval.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{approval.salespersonName}</h3>
                  <Badge variant="warning" size="sm">
                    <Clock size={12} className="mr-1" />
                    Pending
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Requested on:</strong> {new Date(approval.requestedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Period:</strong> {approval.month} {approval.year}
                </p>
                {approval.reason && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Reason:</strong> {approval.reason}
                  </p>
                )}
              </div>
              <AlertCircle className="text-yellow-500" size={20} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Current Target</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₱{(approval.currentTarget / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Requested Target</p>
                <p className="text-lg font-semibold text-blue-600">
                  ₱{(approval.requestedTarget / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ {(((approval.requestedTarget - approval.currentTarget) / approval.currentTarget) * 100).toFixed(0)}% increase
                </p>
              </div>
            </div>
            
            {/* ApprovalActions component is used here */}
            <ApprovalActions
              approvalId={approval.id}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

// Import CheckCircle for the empty state
import { CheckCircle } from 'lucide-react';