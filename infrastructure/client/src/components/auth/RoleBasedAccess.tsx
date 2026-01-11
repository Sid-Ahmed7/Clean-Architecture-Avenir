"use client";

import { useContext, ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { RoleEnum } from "@/types/RoleEnum";

interface RoleBasedAccessProps {
  allowedRoles: (RoleEnum | string)[];
  children: ReactNode;
  fallback?: ReactNode;
}


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


export const createRoleBasedComponent = (role: RoleEnum | string) => {
  return ({ children, fallback }: Omit<RoleBasedAccessProps, "allowedRoles">) => (
    <RoleBasedAccess allowedRoles={[role]} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  );
};

// Pre-defined components for common roles
export const ClientOnly = createRoleBasedComponent(RoleEnum.CLIENT);
export const AdvisorOnly = createRoleBasedComponent(RoleEnum.BANK_ADVISOR);
export const ManagerOnly = createRoleBasedComponent(RoleEnum.BANK_MANAGER);