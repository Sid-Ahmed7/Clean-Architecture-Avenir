"use client";

import { useContext, ComponentType, ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { RoleEnum } from "@/types/RoleEnum";
import { useRouter } from "next/navigation";

interface WithRoleProtectionProps {
  allowedRoles: (RoleEnum | string)[];
  redirectPath?: string;
  fallbackComponent?: ReactNode;
}


export const withRoleProtection = <P extends object>(
  Component: ComponentType<P>,
  { allowedRoles, redirectPath = "/", fallbackComponent }: WithRoleProtectionProps
) => {
  return function ProtectedComponent(props: P) {
    const { hasAnyRole, isAuthenticated } = useContext(AuthContext);
    const router = useRouter();

    // If authentication is still being determined, don't render anything
    if (isAuthenticated === undefined) {
      return null;
    }

    // If user is not authenticated, redirect to login
    if (isAuthenticated === false) {
      router.push("/login");
      return null;
    }

    // If user doesn't have any of the allowed roles
    if (!hasAnyRole(allowedRoles)) {
      // If a fallback component is provided, render it
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }

      // Otherwise, redirect to the specified path
      router.push(redirectPath);
      return null;
    }

    // If user has the required role, render the protected component
    return <Component {...props} />;
  };
};

/**
 * Creates a higher-order component that protects a page for a specific role
 * @param role - The role to check for
 * @param redirectPath - Path to redirect to if user doesn't have the role
 * @param fallbackComponent - Optional component to render instead of redirecting
 * @returns A higher-order component that protects a page for the specified role
 */
export const createRoleProtection = (
  role: RoleEnum | string,
  redirectPath?: string,
  fallbackComponent?: ReactNode
) => {
  return <P extends object>(Component: ComponentType<P>) =>
    withRoleProtection(Component, {
      allowedRoles: [role],
      redirectPath,
      fallbackComponent,
    });
};

// Pre-defined HOCs for common roles
export const withClientProtection = (redirectPath?: string, fallbackComponent?: ReactNode) =>
  createRoleProtection(RoleEnum.CLIENT, redirectPath, fallbackComponent);

export const withBankAdvisorProtection = (redirectPath?: string, fallbackComponent?: ReactNode) =>
  createRoleProtection(RoleEnum.BANK_ADVISOR, redirectPath, fallbackComponent);

export const withBankManagerProtection = (redirectPath?: string, fallbackComponent?: ReactNode) =>
  createRoleProtection(RoleEnum.BANK_MANAGER, redirectPath, fallbackComponent);