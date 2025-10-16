"use client";

import { useState, useContext, ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import Sidebar from "./ui/Sidebar";
import Header from "./ui/Header";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const locale = useLocale()

  const hideLayout = pathname === `/${locale}/login` || pathname === `/${locale}/register`;

 

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  if(hideLayout) {
    return <>{children}</>
  }
  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <div className="flex-1 flex flex-col">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMenuClick={handleMenuClick}

        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
