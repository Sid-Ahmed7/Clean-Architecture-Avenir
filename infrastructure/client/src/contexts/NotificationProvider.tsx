"use client";

import { createContext, ReactNode, useContext } from "react";
import { useNotification } from "@/lib/hooks/useNotifications";

const NotificationContext = createContext<ReturnType<typeof useNotification> | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const notification = useNotification();

  return (
    <NotificationContext.Provider value={notification}>
      {children}
    </NotificationContext.Provider>
  );
};


