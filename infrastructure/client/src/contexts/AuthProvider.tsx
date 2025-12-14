"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api/apiClient";
import { Token } from "@/types/Token";
import { usePathname } from "next/navigation";
import { LocaleContext } from "./LocaleProvider";
import { RoleEnum } from "@/types/RoleEnum";

export const AuthContext = createContext<{
  isAuthenticated: boolean | undefined;
  user: Token | null;
  setIsAuthenticated: (isAuthenticated: boolean | undefined) => void;
  setUser: (user: Token | null) => void;
  hasRole: (role: RoleEnum | string) => boolean;
  hasAnyRole: (roles: (RoleEnum | string)[]) => boolean;
}>({
  isAuthenticated: undefined,
  user: null,
  setIsAuthenticated: () => { },
  setUser: () => { },
  hasRole: () => false,
  hasAnyRole: () => false
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [user, setUser] = useState<Token | null>(null);
  const pathname = usePathname();
  const { locale } = useContext(LocaleContext);
  const hiddenPaths = [`/${locale}/login`, `/${locale}/register`, `/${locale}/register-advisor`, `/${locale}/confirm`, `/${locale}/create-manager`];

  useEffect(() => {
    if (hiddenPaths.includes(pathname)) return;

    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/auth/profile");
        setUser({
          userId: res.data.user.id,
          role: res.data.user.role
        });

        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    fetchUser();
  }, []);

  // Check if user has a specific role
  const hasRole = (role: RoleEnum | string): boolean => {
    if (!user || !isAuthenticated) return false;
    return user.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: (RoleEnum | string)[]): boolean => {
    if (!user || !isAuthenticated) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      setIsAuthenticated,
      setUser,
      hasRole,
      hasAnyRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}
