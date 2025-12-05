"use client";

import { useContext, ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { RoleEnum } from "@/types/RoleEnum";

interface RoleBasedAccessProps {
  allowedRoles: (RoleEnum | string)[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders content based on user roles
 * @param allowedRoles - Array of roles that are allowed to access the content
 * @param children - Content to render if user has the required role
 * @param fallback - Optional content to render if user doesn't have the required role
 */
export const RoleBasedAccess = ({
  allowedRoles,
  children,
  fallback = null,
}: RoleBasedAccessProps) => {
  const { hasAnyRole, isAuthenticated } = useContext(AuthContext);

  // If authentication is still being determined, don't render anything
  if (isAuthenticated === undefined) {
    return null;
  }

  // If user has any of the allowed roles, render the children
  if (hasAnyRole(allowedRoles)) {
    return <>{children}</>;
  }

  // Otherwise, render the fallback content
  return <>{fallback}</>;
};

/**
 * Higher-order component that creates a RoleBasedAccess component for a specific role
 * @param role - The role to check for
 * @returns A component that only renders its children if the user has the specified role
 */
export const createRoleBasedComponent = (role: RoleEnum | string) => {
  return ({ children, fallback }: Omit<RoleBasedAccessProps, "allowedRoles">) => (
    <RoleBasedAccess allowedRoles={[role]} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  );
};

// Pre-defined components for common roles
export const ClientOnly = createRoleBasedComponent(RoleEnum.CLIENT);
export const BankAdvisorOnly = createRoleBasedComponent(RoleEnum.BANK_ADVISOR);
export const BankManagerOnly = createRoleBasedComponent(RoleEnum.BANK_MANAGER);
export const AdminOnly = createRoleBasedComponent(RoleEnum.ADMIN);