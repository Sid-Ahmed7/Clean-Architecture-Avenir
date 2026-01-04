"use client";

import { usePathname } from "next/navigation";
import { useContext, ReactNode } from "react";
import { LocaleContext } from "@/contexts/LocaleProvider";
import AppLayout from "./AppLayout";

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

  // Check if current path is the home page or a public page
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isPublicPage = isHomePage || publicPages.some(page => pathname === page || pathname.startsWith(`${page}/`));

  console.log('[ConditionalLayout] pathname:', pathname);
  console.log('[ConditionalLayout] locale:', locale);
  console.log('[ConditionalLayout] isHomePage:', isHomePage);
  console.log('[ConditionalLayout] isPublicPage:', isPublicPage);
  console.log('[ConditionalLayout] Should render AppLayout:', !isPublicPage);

  if (isPublicPage) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}
