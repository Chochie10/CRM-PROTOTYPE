import { Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../auth/authProtected';
import { MainLayout } from '../layouts/MainLayout';

// Pages
import DashboardPage from '../pages/DashboardPage';
// import DailySalesPage from '../pages/DailySalesPage';
// import TargetsPage from '../pages/TargetsPage';
import ApprovalsPage from '../pages/Approval';
import TeamPerformancePage from '../pages/TeamPerformance';
// import ReportsPage from '../pages/ReportsPage';
// import RankingsPage from '../pages/RankingsPage';
import UsersPage from '../pages/User';
// import AuditLogsPage from '../pages/AuditLogsPage';
// import SettingsPage from '../pages/SettingsPage';
import LoginPage from '../pages/loginform';
import RolesPage from '../pages/Role';
import CompliancePage from '../pages/Compliance';
import AnalyticsPage from '../pages/Analytics';
import ReportsPage from '../pages/Reports';

const AppNavigation = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes with Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* <Route path="daily-sales" element={
          <ProtectedRoute allowedRoles={["SALESPERSON"]}>
            <DailySalesPage />
          </ProtectedRoute>
        } />
        <Route path="targets" element={
          <ProtectedRoute allowedRoles={["SALESPERSON"]}>
            <TargetsPage />
          </ProtectedRoute>
        } /> */}
        
        <Route path="approvals" element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <ApprovalsPage />
          </ProtectedRoute>
        } />
        
        <Route path="team-performance" element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <TeamPerformancePage />
          </ProtectedRoute>
        } />
        
        {/* <Route path="rankings" element={
          <ProtectedRoute allowedRoles={["MANAGER", "EXECOM"]}>
            <RankingsPage />
          </ProtectedRoute>
        } /> */}
        
        <Route path="users" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <UsersPage />
          </ProtectedRoute>
        } />
        
        {/* <Route path="audit-logs" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AuditLogsPage />
          </ProtectedRoute>
        } /> */}
        
        {/* <Route path="settings" element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
            <SettingsPage />
          </ProtectedRoute>
        } /> */}
        
        <Route path="roles" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <RolesPage />
          </ProtectedRoute>
        } />
        
        <Route path="compliance" element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <CompliancePage />
          </ProtectedRoute>
        } />
        
        {/* MOVED INSIDE THE LAYOUT - Analytics */}
        <Route path="analytics" element={
          <ProtectedRoute allowedRoles={["MANAGER", "EXECOM"]}>
            <AnalyticsPage />
          </ProtectedRoute>
        } />
        
        {/* MOVED INSIDE THE LAYOUT - Reports */}
        <Route path="reports" element={
          <ProtectedRoute allowedRoles={["SALESPERSON", "MANAGER", "EXECOM", "ADMIN"]}>
            <ReportsPage />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default AppNavigation;