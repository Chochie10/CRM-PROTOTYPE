import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { MOCK_USERS } from '../../data/mockUsers';
import { MOCK_CENTERS } from '../../data/mockCenters';
import type { User, UserRole } from '../../types';

const UserManagementContainer = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'SALESPERSON',
    centerId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setUsers(MOCK_USERS);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email?.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.role) newErrors.role = 'Role is required';
    
    if (formData.role !== 'EXECOM' && formData.role !== 'ADMIN' && !formData.centerId) {
      newErrors.centerId = 'Center is required for this role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = () => {
    if (!validateForm()) return;
    
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: formData.name!,
      email: formData.email!,
      role: formData.role as UserRole,
      centerId: formData.centerId,
    };
    
    setUsers([...users, newUser]);
    setShowAddModal(false);
    resetForm();
    alert('User added successfully!');
  };

  const handleEditUser = () => {
    if (!validateForm() || !selectedUser) return;
    
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? { ...user, ...formData }
        : user
    );
    
    setUsers(updatedUsers);
    setShowEditModal(false);
    resetForm();
    alert('User updated successfully!');
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setShowDeleteModal(false);
    setSelectedUser(null);
    alert('User deleted successfully!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'SALESPERSON',
      centerId: '',
    });
    setErrors({});
    setSelectedUser(null);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      centerId: user.centerId,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const roleOptions = [
    { value: 'SALESPERSON', label: 'Salesperson' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'EXECOM', label: 'Executive Committee' },
    { value: 'ADMIN', label: 'Administrator' },
  ];

  const centerOptions = [
    { value: '', label: 'Select Center' },
    ...MOCK_CENTERS.map(center => ({ value: center.id, label: center.name }))
  ];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'MANAGER': return 'info';
      case 'EXECOM': return 'warning';
      default: return 'success';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage system users and roles</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="mr-1" />
          Add User
        </Button>
      </div>

      <Card>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Center</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getRoleBadgeColor(user.role)} size="sm">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {user.centerId ? MOCK_CENTERS.find(c => c.id === user.centerId)?.name || '-' : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          )}
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New User"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />
          
          <Select
            label="Role"
            options={roleOptions}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole, centerId: '' })}
            error={errors.role}
          />
          
          {(formData.role !== 'EXECOM' && formData.role !== 'ADMIN') && (
            <Select
              label="Assigned Center"
              options={centerOptions}
              value={formData.centerId}
              onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
              error={errors.centerId}
            />
          )}
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUser}>
              Add User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit User"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />
          
          <Select
            label="Role"
            options={roleOptions}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            error={errors.role}
          />
          
          {(formData.role !== 'EXECOM' && formData.role !== 'ADMIN') && (
            <Select
              label="Assigned Center"
              options={centerOptions}
              value={formData.centerId}
              onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
              error={errors.centerId}
            />
          )}
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditUser}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        title="Delete User"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
            </p>
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone. All data associated with this user will be permanently removed.
            </p>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementContainer;