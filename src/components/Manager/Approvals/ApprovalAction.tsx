import React, { useState } from 'react';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { CheckCircle, XCircle } from 'lucide-react';

interface ApprovalActionsProps {
  approvalId: string;
  onApprove: (id: string, comments?: string) => Promise<void>;
  onReject: (id: string, comments?: string) => Promise<void>;
}

export const ApprovalActions: React.FC<ApprovalActionsProps> = ({
  approvalId,
  onApprove,
  onReject,
}) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    await onApprove(approvalId, comments);
    setProcessing(false);
    setShowApproveModal(false);
    setComments('');
  };

  const handleReject = async () => {
    setProcessing(true);
    await onReject(approvalId, comments);
    setProcessing(false);
    setShowRejectModal(false);
    setComments('');
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="success"
          size="sm"
          onClick={() => setShowApproveModal(true)}
        >
          <CheckCircle size={16} className="mr-1" />
          Approve
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowRejectModal(true)}
        >
          <XCircle size={16} className="mr-1" />
          Reject
        </Button>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Request"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to approve this request? This action cannot be undone.
          </p>
          <Input
            label="Comments (Optional)"
            placeholder="Add any additional comments..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowApproveModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleApprove}
              loading={processing}
            >
              Approve
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Request"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to reject this request? Please provide a reason.
          </p>
          <Input
            label="Reason for Rejection"
            placeholder="Please explain why this request is being rejected..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            required
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              loading={processing}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};