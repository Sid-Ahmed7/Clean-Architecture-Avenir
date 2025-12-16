import { RoleEnum } from "@/types/RoleEnum";

/**
 * Maps a user role to its corresponding URL prefix
 * @param role - The user's role from RoleEnum
 * @returns The URL prefix for the role (e.g., 'client', 'admin', 'advisor', 'manager')
 */
export function getRolePrefix(role: string | undefined): string {
  const rolePrefixMap: Record<string, string> = {
    [RoleEnum.CLIENT]: 'client',
    [RoleEnum.BANK_ADVISOR]: 'advisor',
    [RoleEnum.BANK_MANAGER]: 'manager'
  };
  
  return rolePrefixMap[role || RoleEnum.CLIENT] || 'client';
}

/**
 * Gets the dashboard URL for a specific role
 * @param role - The user's role
 * @param locale - The current locale
 * @returns The full dashboard URL path
 */
export function getDashboardUrl(role: string | undefined, locale: string = 'en'): string {
  const prefix = getRolePrefix(role);
  return `/${locale}/${prefix}/dashboard`;
}
