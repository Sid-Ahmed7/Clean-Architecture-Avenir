"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";


export const AuthContext = createContext<{
    isAuthenticated: boolean | undefined;
    setIsAuthenticated: (isAuthenticated: boolean | undefined) => void;
}>({
    isAuthenticated: undefined,
    setIsAuthenticated: () => {}
});

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
   
    
    useEffect(() => {
        const isAuthenticated = Cookies.get("accessToken");
        setIsAuthenticated(Boolean(isAuthenticated) ?? false);
    }, []);

    return ( 
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );




}