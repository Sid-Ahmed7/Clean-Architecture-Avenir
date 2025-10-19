"use client";

import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Token } from "@/types/token";
import { getUserFromToken } from "@/lib/utils/decodeJwt";


export const AuthContext = createContext<{
    isAuthenticated: boolean | undefined;
    user: Token | null;
    setIsAuthenticated: (isAuthenticated: boolean | undefined) => void;
    
}>({
    isAuthenticated: undefined,
    user: null,
    setIsAuthenticated: () => {}
});

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
    const [user, setUser] = useState<Token | null>(null);
    
    useEffect(() => {
        const decodedToken = getUserFromToken();
        setUser(decodedToken);
        setIsAuthenticated(Boolean(decodedToken));
    }, []);

    return ( 
        <AuthContext.Provider value={{isAuthenticated, user, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );




}