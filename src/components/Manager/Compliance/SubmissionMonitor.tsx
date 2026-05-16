import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/authContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { Calendar, Bell, Send } from 'lucide-react';
import { MOCK_USERS } from '../../../data/mockUsers';
import { MOCK_DAILY_SALES } from '../../../data/mockSales';

export const SubmissionMonitor = () => {
  const { user } = useAuth();
  const [todaySubmissions, setTodaySubmissions] = useState<any[]>([]);
  const [reminderSent, setReminderSent] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user?.centerId) {
      const today = new Date().toISOString().split('T')[0];
      const team = MOCK_USERS.filter(u => u.centerId === user.centerId && u.role === "SALESPERSON");
      
      const submissions = team.map(member => {
        const hasSubmitted = MOCK_DAILY_SALES.some(sale => 
          sale.userId === member.id && sale.date === today
        );
        
        return {
          userId: member.id,
          userName: member.name,
          hasSubmitted,
          lastSubmissionDate: MOCK_DAILY_SALES
            .filter(sale => sale.userId === member.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date,
        };
      });
      
      setTodaySubmissions(submissions);
    }
  }, [user]);

  const sendReminder = (userId: string, userName: string) => {
    setReminderSent(prev => ({ ...prev, [userId]: true }));
    alert(`Reminder sent to ${userName} to submit today's sales report.`);
    setTimeout(() => {
      setReminderSent(prev => ({ ...prev, [userId]: false }));
    }, 3000);
  };

  const sendBulkReminder = () => {
    const pendingSubmissions = todaySubmissions.filter(s => !s.hasSubmitted);
    if (pendingSubmissions.length === 0) {
      alert('All team members have submitted today\'s sales!');
      return;
    }
    
    pendingSubmissions.forEach(member => {
      setReminderSent(prev => ({ ...prev, [member.userId]: true }));
    });
    
    alert(`Reminders sent to ${pendingSubmissions.length} team member(s).`);
    
    setTimeout(() => {
      const newReminderSent = { ...reminderSent };
      pendingSubmissions.forEach(member => {
        newReminderSent[member.userId] = false;
      });
      setReminderSent(newReminderSent);
    }, 3000);
  };

  const submittedCount = todaySubmissions.filter(s => s.hasSubmitted).length;
  const totalCount = todaySubmissions.length;
  const completionRate = totalCount > 0 ? (submittedCount / totalCount) * 100 : 0;

  return (
    <Card title="Today's Submission Monitor">
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Today's Submission Progress</p>
            <p className="text-2xl font-bold text-gray-900">
              {submittedCount} / {totalCount}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-lg font-semibold text-green-600">{completionRate.toFixed(0)}%</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-green-600 rounded-full h-2 transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {todaySubmissions.map((member) => (
          <div
            key={member.userId}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              member.hasSubmitted ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{member.userName}</p>
                {member.hasSubmitted ? (
                  <Badge variant="success" size="sm">Submitted</Badge>
                ) : (
                  <Badge variant="warning" size="sm">Pending</Badge>
                )}
              </div>
              {member.lastSubmissionDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Last submission: {member.lastSubmissionDate}
                </p>
              )}
            </div>
            
            {!member.hasSubmitted && (
              <Button
                variant="warning"
                size="sm"
                onClick={() => sendReminder(member.userId, member.userName)}
                loading={reminderSent[member.userId]}
              >
                <Bell size={14} className="mr-1" />
                Remind
              </Button>
            )}
          </div>
        ))}
      </div>

      {submittedCount < totalCount && (
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="primary"
            fullWidth
            onClick={sendBulkReminder}
          >
            <Send size={16} className="mr-2" />
            Send Reminders to All
          </Button>
        </div>
      )}
    </Card>
  );
};