import React from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Users, Shield, FileText, Settings, Plus, Edit, Trash2 } from "lucide-react";
import { MOCK_USERS } from "../../data/mockUsers";

const AdminDashboard = () => {
  const userStats = {
    total: MOCK_USERS.length,
    salespersons: MOCK_USERS.filter(u => u.role === "SALESPERSON").length,
    managers: MOCK_USERS.filter(u => u.role === "MANAGER").length,
    execom: MOCK_USERS.filter(u => u.role === "EXECOM").length,
    admin: MOCK_USERS.filter(u => u.role === "ADMIN").length,
  };
  
  const recentAuditLogs = [
    { id: 1, user: "john.northgate@informatics.com", action: "Submitted daily sales", timestamp: "2024-01-15 14:30", ip: "192.168.1.1" },
    { id: 2, user: "manager.manila@informatics.com", action: "Approved target revision", timestamp: "2024-01-15 13:45", ip: "192.168.1.2" },
    { id: 3, user: "admin@informatics.com", action: "Modified user permissions", timestamp: "2024-01-15 11:20", ip: "192.168.1.3" },
    { id: 4, user: "execom@informatics.com", action: "Exported executive report", timestamp: "2024-01-15 10:15", ip: "192.168.1.4" },
    { id: 5, user: "maria.manila@informatics.com", action: "Updated monthly target", timestamp: "2024-01-15 09:30", ip: "192.168.1.5" },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
        <p className="text-gray-500 mt-1">Manage users, roles, and system configuration</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* <Card>
          <div className="text-center">
            <Users className="mx-auto text-blue-600 mb-2" size={32} />
            <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
        </Card> */}
        
        <Card>
          <div className="text-center">
            <Users className="mx-auto text-green-600 mb-2" size={32} />
            <p className="text-2xl font-bold text-gray-900">{userStats.salespersons}</p>
            <p className="text-sm text-gray-500">Salespersons</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <Shield className="mx-auto text-purple-600 mb-2" size={32} />
            <p className="text-2xl font-bold text-gray-900">{userStats.managers}</p>
            <p className="text-sm text-gray-500">Managers</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <Shield className="mx-auto text-yellow-600 mb-2" size={32} />
            <p className="text-2xl font-bold text-gray-900">{userStats.execom}</p>
            <p className="text-sm text-gray-500">Execom</p>
          </div>
        </Card>
        
        {/* <Card>
          <div className="text-center">
            <Settings className="mx-auto text-red-600 mb-2" size={32} />
            <p className="text-2xl font-bold text-gray-900">{userStats.admin}</p>
            <p className="text-sm text-gray-500">Admins</p>
          </div>
        </Card> */}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="User Management" 
          actions={
            <Button variant="primary" size="sm">
              <Plus size={16} className="mr-1" />
              Add User
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {MOCK_USERS.slice(0, 5).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "ADMIN" ? "bg-red-100 text-red-800" :
                        user.role === "MANAGER" ? "bg-blue-100 text-blue-800" :
                        user.role === "EXECOM" ? "bg-purple-100 text-purple-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="secondary" fullWidth className="mt-4">
            View All Users
          </Button>
        </Card>
        
        <Card title="Recent Audit Logs">
          <div className="space-y-3">
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500 mt-1">By: {log.user}</p>
                  <div className="flex gap-3 mt-1">
                    <p className="text-xs text-gray-400">{log.timestamp}</p>
                    <p className="text-xs text-gray-400">IP: {log.ip}</p>
                  </div>
                </div>
                <FileText size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
          <Button variant="secondary" fullWidth className="mt-4">
            View Full Audit Log
          </Button>
        </Card>
      </div>
      
      <Card title="System Settings">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Enable system maintenance mode</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Audit Logging</p>
              <p className="text-sm text-gray-500">Enable detailed audit logging</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Send system notifications via email</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;