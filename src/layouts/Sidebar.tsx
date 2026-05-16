import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Target, 
  FileText, 
  CheckCircle, 
  Users, 
  Shield, 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '../components/common/Button';

const iconMap: Record<string, any> = {
  LayoutDashboard, 
  ClipboardList, 
  Target, 
  FileText,
  CheckCircle, 
  Users, 
  Shield, 
  BarChart3, 
  TrendingUp,
  Trophy, 
  Settings
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const getNavigationByRole = () => {
    const role = user.role;
    
    if (role === "SALESPERSON") {
      return [
        { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
        { name: "Daily Sales", path: "/daily-sales", icon: "ClipboardList" },
        { name: "Targets", path: "/targets", icon: "Target" },
        { name: "Reports", path: "/reports", icon: "FileText" },
      ];
    } else if (role === "MANAGER") {
      return [
        { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
        { name: "Approvals", path: "/approvals", icon: "CheckCircle" },
        { name: "Team Performance", path: "/team-performance", icon: "Users" },
        { name: "Compliance", path: "/compliance", icon: "Shield" },
        { name: "Analytics", path: "/analytics", icon: "BarChart3" },
        { name: "Reports", path: "/reports", icon: "FileText" },
        { name: "Rankings", path: "/rankings", icon: "Trophy" },
        { name: "Settings", path: "/settings", icon: "Settings" },
      ];
    } else if (role === "EXECOM") {
      return [
        { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
        { name: "Enterprise Analytics", path: "/analytics", icon: "TrendingUp" },
        { name: "Reports", path: "/reports", icon: "FileText" },
        { name: "Rankings", path: "/rankings", icon: "Trophy" },
      ];
    } else { // ADMIN
      return [
        { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
        { name: "Users", path: "/users", icon: "Users" },
        { name: "Roles", path: "/roles", icon: "Shield" },
        { name: "Audit Logs", path: "/audit-logs", icon: "FileText" },
        { name: "Reports", path: "/reports", icon: "FileText" },
        { name: "Settings", path: "/settings", icon: "Settings" },
      ];
    }
  };
  
  const navigation = getNavigationByRole();
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">SPMS</h1>
          <p className="text-sm text-gray-500 mt-1">Sales Performance</p>
          <p className="text-xs text-gray-400 mt-0.5">Management System</p>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {Icon && <Icon size={20} className="mr-3" />}
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
        
        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
              {user.centerId && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {user.centerId.replace('center_', '').charAt(0).toUpperCase() + user.centerId.slice(8)}
                </p>
              )}
            </div>
          </div>
          <Button variant="secondary" size="sm" fullWidth onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
};