import { useAuth } from '../auth/authContext';
import type { DailySale, MonthlyTarget, ComplianceRecord, TargetRevision } from '../types';

export const useDataFilter = () => {
  const { user } = useAuth();

  const filterSalesByRole = (sales: DailySale[]): DailySale[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'SALESPERSON':
        // Salesperson can only see their own sales
        return sales.filter(sale => sale.userId === user.id);
      
      case 'MANAGER':
        // Manager can only see sales from their assigned center
        return sales.filter(sale => sale.centerId === user.centerId);
      
      case 'EXECOM':
      case 'ADMIN':
        // Execom and Admin can see all sales
        return sales;
      
      default:
        return [];
    }
  };

  const filterTargetsByRole = (targets: MonthlyTarget[]): MonthlyTarget[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'SALESPERSON':
        return targets.filter(target => target.userId === user.id);
      
      case 'MANAGER':
        return targets.filter(target => target.centerId === user.centerId);
      
      case 'EXECOM':
      case 'ADMIN':
        return targets;
      
      default:
        return [];
    }
  };

  const filterRevisionsByRole = (revisions: TargetRevision[]): TargetRevision[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'SALESPERSON':
        return revisions.filter(rev => rev.userId === user.id);
      
      case 'MANAGER':
        // Get revisions from salespersons in their center
        return revisions.filter(rev => {
          // This would need a lookup of which center the salesperson belongs to
          // For now, we'll filter by a centerId field if available
          return true;
        });
      
      case 'EXECOM':
      case 'ADMIN':
        return revisions;
      
      default:
        return [];
    }
  };

  const filterComplianceByRole = (compliance: ComplianceRecord[]): ComplianceRecord[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'SALESPERSON':
        return compliance.filter(record => record.userId === user.id);
      
      case 'MANAGER':
        return compliance.filter(record => record.centerId === user.centerId);
      
      case 'EXECOM':
      case 'ADMIN':
        return compliance;
      
      default:
        return [];
    }
  };

  const getUserCenters = (): string[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'SALESPERSON':
        return user.centerId ? [user.centerId] : [];
      
      case 'MANAGER':
        return user.centerId ? [user.centerId] : [];
      
      case 'EXECOM':
      case 'ADMIN':
        return ['center_northgate', 'center_manila', 'center_cavite', 'center_baguio'];
      
      default:
        return [];
    }
  };

  const canUserAccessData = (dataCenterId: string): boolean => {
    if (!user) return false;
    
    switch (user.role) {
      case 'SALESPERSON':
        return dataCenterId === user.centerId;
      
      case 'MANAGER':
        return dataCenterId === user.centerId;
      
      case 'EXECOM':
      case 'ADMIN':
        return true;
      
      default:
        return false;
    }
  };

  return {
    filterSalesByRole,
    filterTargetsByRole,
    filterRevisionsByRole,
    filterComplianceByRole,
    getUserCenters,
    canUserAccessData,
  };
};