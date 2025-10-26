"use client";

import { createContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api/apiClient"; // ton axios instance
import { Token } from "@/types/token";

export const AuthContext = createContext<{
  isAuthenticated: boolean | undefined;
  user: Token | null;
  setIsAuthenticated: (isAuthenticated: boolean | undefined) => void;
}>({
  isAuthenticated: undefined,
  user: null,
  setIsAuthenticated: () => {}
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [user, setUser] = useState<Token | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/auth/profile");
        setUser({ 
  userId: res.data.user.id, // <- map id -> userId
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
