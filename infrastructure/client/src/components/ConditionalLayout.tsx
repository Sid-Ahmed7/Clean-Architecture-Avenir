"use client";

import { usePathname } from "next/navigation";
import { useContext, ReactNode } from "react";
import { LocaleContext } from "@/contexts/LocaleProvider";
import AppLayout from "./AppLayout";
import Header from './landing/Header';

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { locale } = useContext(LocaleContext);

  const publicPages = [
    `/${locale}/login`,
    `/${locale}/register`,
    `/${locale}/create-manager`,
    `/${locale}/confirm`,
    `/${locale}/about`,
    `/${locale}/contact`,
    `/${locale}/help`,
    `/${locale}/legal`,
  ];

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isPublicPage = isHomePage || publicPages.some(page => pathname === page || pathname.startsWith(`${page}/`));

  if (isPublicPage) {
    const showHeader = !isHomePage;
    return <>
      {showHeader && <Header />}
      {children}
    </>;
  }

  return <AppLayout>{children}</AppLayout>;
}
