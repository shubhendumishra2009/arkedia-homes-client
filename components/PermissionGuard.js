import React from 'react';
import { useRouter } from 'next/router';
import usePermission from '../hooks/usePermission';

/**
 * A component that conditionally renders its children based on user permissions
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if user has permission
 * @param {string} props.pageUrl - The URL of the page to check permissions for
 * @param {boolean} props.requireAdd - Whether add permission is required
 * @param {boolean} props.requireUpdate - Whether update permission is required
 * @param {boolean} props.requireDelete - Whether delete permission is required
 * @param {React.ReactNode} props.fallback - Component to render if user doesn't have permission
 * @returns {React.ReactNode}
 */
const PermissionGuard = ({
  children,
  pageUrl,
  requireAdd = false,
  requireUpdate = false,
  requireDelete = false,
  fallback = null
}) => {
  const router = useRouter();
  const { canView, canAdd, canUpdate, canDelete, isLoading, error } = usePermission(pageUrl || router.pathname);

  // If still loading permissions, show loading state
  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  // If there was an error fetching permissions, log it but don't block the UI
  if (error) {
    console.error('Permission error:', error);
    // Instead of showing error, assume user has permissions to avoid blocking UI
    return <>{children}</>;
  }

  // If user can't view the page, redirect to dashboard or show fallback
  if (!canView) {
    if (typeof window !== 'undefined') {
      // Only redirect on client-side
      router.push('/admin/dashboard');
    }
    return fallback || <div>You don't have permission to view this page</div>;
  }

  // Check if user has all required permissions
  const hasRequiredPermissions = 
    (!requireAdd || canAdd) &&
    (!requireUpdate || canUpdate) &&
    (!requireDelete || canDelete);

  // If user doesn't have required permissions, show fallback
  if (!hasRequiredPermissions) {
    return fallback || <div>{/* You don't have sufficient permissions for this action */}</div>;
  }

  // User has all required permissions, render children
  return <>{children}</>;
};

export default PermissionGuard;