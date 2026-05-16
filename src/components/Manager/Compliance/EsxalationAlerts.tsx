import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/authContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { AlertTriangle, Bell, CheckCircle, TrendingUp } from 'lucide-react';
import { MOCK_USERS } from '../../../data/mockUsers';
import { MOCK_DAILY_SALES } from '../../../data/mockSales';

interface EscalationAlert {
  id: string;
  userId: string;
  userName: string;
  type: 'missed_deadline' | 'low_compliance' | 'repeated_miss';
  severity: 'high' | 'medium' | 'low';
  message: string;
  daysMissed: number;
  complianceRate: number;
  date: string;
  acknowledged: boolean;
}

export const EscalationAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<EscalationAlert[]>([]);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  useEffect(() => {
    if (user?.centerId) {
      const team = MOCK_USERS.filter(u => u.centerId === user.centerId && u.role === "SALESPERSON");
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const today = new Date();
      
      const generatedAlerts: EscalationAlert[] = [];
      
      team.forEach(member => {
        const memberSales = MOCK_DAILY_SALES.filter(sale => 
          sale.userId === member.id &&
          new Date(sale.date).getMonth() === currentMonth &&
          new Date(sale.date).getFullYear() === currentYear
        );
        
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const actualSubmissions = memberSales.length;
        const complianceRate = (actualSubmissions / daysInMonth) * 100;
        
        // Find consecutive missed days
        const submittedDates = new Set(memberSales.map(s => s.date));
        let consecutiveMissed = 0;
        for (let i = 1; i <= 5; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const dateStr = checkDate.toISOString().split('T')[0];
          if (!submittedDates.has(dateStr) && checkDate <= today) {
            consecutiveMissed++;
          } else {
            break;
          }
        }
        
        // Generate alerts based on criteria
        if (consecutiveMissed >= 3) {
          generatedAlerts.push({
            id: `alert_${member.id}_missed`,
            userId: member.id,
            userName: member.name,
            type: 'missed_deadline',
            severity: consecutiveMissed >= 5 ? 'high' : 'medium',
            message: `${member.name} has missed ${consecutiveMissed} consecutive days of sales submission.`,
            daysMissed: consecutiveMissed,
            complianceRate,
            date: new Date().toISOString(),
            acknowledged: false,
          });
        }
        
        if (complianceRate < 70) {
          generatedAlerts.push({
            id: `alert_${member.id}_compliance`,
            userId: member.id,
            userName: member.name,
            type: 'low_compliance',
            severity: complianceRate < 50 ? 'high' : 'medium',
            message: `${member.name} has low compliance rate of ${complianceRate.toFixed(1)}% for this month.`,
            daysMissed: daysInMonth - actualSubmissions,
            complianceRate,
            date: new Date().toISOString(),
            acknowledged: false,
          });
        }
      });
      
      setAlerts(generatedAlerts);
    }
  }, [user]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const escalateAll = () => {
    const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
    if (unacknowledgedAlerts.length === 0) {
      alert('No pending alerts to escalate.');
      return;
    }
    alert(`Escalated ${unacknowledgedAlerts.length} alert(s) to upper management.`);
    unacknowledgedAlerts.forEach(alert => acknowledgeAlert(alert.id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle size={20} />;
      case 'medium': return <Bell size={20} />;
      case 'low': return <TrendingUp size={20} />;
      default: return <AlertTriangle size={20} />;
    }
  };

  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'missed_deadline': return 'Missed Deadline';
      case 'low_compliance': return 'Low Compliance';
      case 'repeated_miss': return 'Repeated Misses';
      default: return 'Alert';
    }
  };

  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  return (
    <Card 
      title="Escalation Alerts" 
      actions={
        activeAlerts.length > 0 && (
          <Button variant="danger" size="sm" onClick={escalateAll}>
            <AlertTriangle size={14} className="mr-1" />
            Escalate All ({activeAlerts.length})
          </Button>
        )
      }
    >
      <div className="mb-4 flex gap-2">
        <Button
          variant={!showAcknowledged ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setShowAcknowledged(false)}
        >
          Active ({activeAlerts.length})
        </Button>
        <Button
          variant={showAcknowledged ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setShowAcknowledged(true)}
        >
          Acknowledged ({acknowledgedAlerts.length})
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {(showAcknowledged ? acknowledgedAlerts : activeAlerts).map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {getSeverityIcon(alert.severity)}
                <div>
                  <p className="font-semibold text-gray-900">{alert.userName}</p>
                  <p className="text-xs text-gray-500">{getAlertTypeText(alert.type)}</p>
                </div>
              </div>
              <Badge variant={alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'info'} size="sm">
                {alert.severity.toUpperCase()}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{alert.message}</p>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {alert.type === 'missed_deadline' && (
                  <span>⚠️ {alert.daysMissed} days missed consecutively</span>
                )}
                {alert.type === 'low_compliance' && (
                  <span>📊 Compliance: {alert.complianceRate.toFixed(1)}%</span>
                )}
              </div>
              
              {!alert.acknowledged && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => acknowledgeAlert(alert.id)}
                >
                  <CheckCircle size={14} className="mr-1" />
                  Acknowledge
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {(showAcknowledged ? acknowledgedAlerts : activeAlerts).length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <p className="text-gray-500">No {showAcknowledged ? 'acknowledged' : 'active'} alerts</p>
            <p className="text-sm text-gray-400 mt-1">
              {showAcknowledged 
                ? 'All alerts have been acknowledged' 
                : 'All team members are compliant'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};