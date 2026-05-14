export type UserRole = "SALESPERSON" | "MANAGER" | "EXECOM" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  centerId?: string;
  avatar?: string;
}

export interface Center {
  id: string;
  name: string;
  managerId: string;
  location: string;
  totalSalespersons: number;
  annualTarget: number;
  currentSales: number;
}

export interface ProductSale {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DailySale {
  id: string;
  userId: string;
  userName: string;
  centerId: string;
  centerName: string;
  date: string;
  amount: number;
  products: ProductSale[];
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
}

export interface MonthlyTarget {
  id: string;
  userId: string;
  userName: string;
  centerId: string;
  centerName: string;
  month: string;
  year: number;
  targetAmount: number;
  achievedAmount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "LOCKED";
  revisionRequest?: TargetRevision;
}

export interface TargetRevision {
  id: string;
  targetId: string;
  userId: string;
  userName: string;
  requestedAmount: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ComplianceRecord {
  userId: string;
  userName: string;
  centerId: string;
  centerName: string;
  month: string;
  year: number;
  expectedSubmissions: number;
  actualSubmissions: number;
  complianceRate: number;
  missedDates: string[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  centerId?: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress: string;
}