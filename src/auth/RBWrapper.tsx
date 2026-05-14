import React from 'react';
import { useAuth } from '../auth/authContext';
import type { UserRole } from '../types';

interface RoleBasedWrapperProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleBasedWrapper: React.FC<RoleBasedWrapperProps> = ({
  children,
  allowedRoles,
  fallback = <div className="text-center py-10 text-gray-500">You don't have permission to view this content.</div>,
}) => {
  const { user } = useAuth();

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};