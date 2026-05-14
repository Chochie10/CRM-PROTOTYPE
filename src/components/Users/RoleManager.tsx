import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../Common/Input';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Shield, Edit, Trash2, Plus, Check, X, Lock } from 'lucide-react';
import type { UserRole } from '../../types';

interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

const RoleManager = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'role_001',
      name: 'SALESPERSON',
      displayName: 'Salesperson',
      description: 'Can submit daily sales, view personal targets, and track own performance',
      permissions: ['view_own_sales', 'submit_sales', 'view_own_targets', 'request_revision', 'view_own_reports'],
      userCount: 8,
    },
    {
      id: 'role_002',
      name: 'MANAGER',
      displayName: 'Manager',
      description: 'Can manage team, approve requests, view center analytics, monitor compliance',
      permissions: ['view_center_sales', 'approve_revisions', 'view_team_performance', 'view_compliance', 'view_center_reports'],
      userCount: 4,
    },
    {
      id: 'role_003',
      name: 'EXECOM',
      displayName: 'Executive Committee',
      description: 'Full organization-wide visibility, executive dashboards, strategic reporting',
      permissions: ['view_all_sales', 'view_all_targets', 'view_enterprise_analytics', 'view_executive_reports', 'view_rankings'],
      userCount: 2,
    },
    {
      id: 'role_004',
      name: 'ADMIN',
      displayName: 'Administrator',
      description: 'Full system access, user management, role management, audit logs',
      permissions: ['manage_users', 'manage_roles', 'view_audit_logs', 'system_settings', 'all_access'],
      userCount: 1,
    },
  ]);

  const [permissions] = useState<Permission[]>([
    // Sales permissions
    { id: 'perm_001', name: 'view_own_sales', category: 'Sales', description: 'View own sales records' },
    { id: 'perm_002', name: 'submit_sales', category: 'Sales', description: 'Submit daily sales' },
    { id: 'perm_003', name: 'view_center_sales', category: 'Sales', description: 'View center sales data' },
    { id: 'perm_004', name: 'view_all_sales', category: 'Sales', description: 'View all sales across organization' },
    
    // Target permissions
    { id: 'perm_005', name: 'view_own_targets', category: 'Targets', description: 'View personal targets' },
    { id: 'perm_006', name: 'request_revision', category: 'Targets', description: 'Request target revisions' },
    { id: 'perm_007', name: 'approve_revisions', category: 'Targets', description: 'Approve target revisions' },
    { id: 'perm_008', name: 'view_all_targets', category: 'Targets', description: 'View all targets' },
    
    // Reports permissions
    { id: 'perm_009', name: 'view_own_reports', category: 'Reports', description: 'View personal reports' },
    { id: 'perm_010', name: 'view_center_reports', category: 'Reports', description: 'View center reports' },
    { id: 'perm_011', name: 'view_executive_reports', category: 'Reports', description: 'View executive reports' },
    
    // Analytics permissions
    { id: 'perm_012', name: 'view_team_performance', category: 'Analytics', description: 'View team performance' },
    { id: 'perm_013', name: 'view_compliance', category: 'Analytics', description: 'View compliance data' },
    { id: 'perm_014', name: 'view_enterprise_analytics', category: 'Analytics', description: 'View enterprise analytics' },
    { id: 'perm_015', name: 'view_rankings', category: 'Analytics', description: 'View rankings' },
    
    // Admin permissions
    { id: 'perm_016', name: 'manage_users', category: 'Admin', description: 'Manage users' },
    { id: 'perm_017', name: 'manage_roles', category: 'Admin', description: 'Manage roles and permissions' },
    { id: 'perm_018', name: 'view_audit_logs', category: 'Admin', description: 'View audit logs' },
    { id: 'perm_019', name: 'system_settings', category: 'Admin', description: 'Configure system settings' },
    { id: 'perm_020', name: 'all_access', category: 'Admin', description: 'Full system access' },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setEditedPermissions([...role.permissions]);
    setShowEditModal(true);
  };

  const handleSavePermissions = () => {
    if (selectedRole) {
      const updatedRoles = roles.map(role =>
        role.id === selectedRole.id
          ? { ...role, permissions: editedPermissions }
          : role
      );
      setRoles(updatedRoles);
      setShowEditModal(false);
      alert(`Permissions updated for ${selectedRole.displayName}`);
    }
  };

  const togglePermission = (permissionName: string) => {
    setEditedPermissions(prev =>
      prev.includes(permissionName)
        ? prev.filter(p => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  const getPermissionsByCategory = () => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    return grouped;
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN': return '🔧';
      case 'MANAGER': return '👥';
      case 'EXECOM': return '🏢';
      default: return '👤';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        <p className="text-gray-500 mt-1">Manage system roles and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card key={role.id}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  {getRoleIcon(role.name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.displayName}</h3>
                  <Badge variant="info" size="sm">
                    {role.userCount} users
                  </Badge>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openEditModal(role)}
              >
                <Edit size={14} className="mr-1" />
                Edit Permissions
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{role.description}</p>
            
            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Permissions</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.slice(0, 5).map(perm => {
                  const permInfo = permissions.find(p => p.name === perm);
                  return (
                    <Badge key={perm} variant="default" size="sm">
                      {permInfo?.description || perm}
                    </Badge>
                  );
                })}
                {role.permissions.length > 5 && (
                  <Badge variant="default" size="sm">
                    +{role.permissions.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Permissions Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Permissions - ${selectedRole?.displayName}`}
        size="lg"
      >
        {selectedRole && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Role:</strong> {selectedRole.displayName}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Select the permissions you want to assign to this role.
              </p>
            </div>

            {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
              <div key={category}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" />
                  {category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        editedPermissions.includes(permission.name)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => togglePermission(permission.name)}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {permission.description}
                        </p>
                        <p className="text-xs text-gray-500">{permission.name}</p>
                      </div>
                      {editedPermissions.includes(permission.name) ? (
                        <Check size={18} className="text-blue-600" />
                      ) : (
                        <X size={18} className="text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSavePermissions}>
                Save Permissions
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Role Info Card */}
      <Card title="About Role-Based Access Control">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Lock size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Role-Based Data Filtering</p>
              <p className="text-xs text-gray-600">
                Salespersons only see their own data. Managers only see their center's data.
                Execom and Admin have organization-wide visibility.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Shield size={20} className="text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Permission Inheritance</p>
              <p className="text-xs text-gray-600">
                Higher roles inherit permissions from lower roles. Admin has full system access.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RoleManager;