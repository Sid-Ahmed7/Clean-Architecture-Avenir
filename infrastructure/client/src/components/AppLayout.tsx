"use client";

import { useState, useContext, ReactNode } from "react";
import Sidebar from "./ui/Sidebar";
import Header from "./ui/Header";
import { usePathname } from "next/navigation";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { NotificationToastContainer } from "./notification/NotificationToastContainer";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useAuthRedirect();

  console.log('[AppLayout] Rendering AppLayout');
  console.log('[AppLayout] isSidebarOpen:', isSidebarOpen);

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <div className="flex-1 flex flex-col">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMenuClick={handleMenuClick}

        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <NotificationToastContainer />
    </div>
  );
}
