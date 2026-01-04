import type { Metadata } from "next";
import "../globals.css";
import AuthProvider from "@/contexts/AuthProvider";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { messagesMap } from "../../../messages";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import LocaleProvider from "@/contexts/LocaleProvider";
import ReactQueryProvider from "@/contexts/ReactQueryProvider";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: {
    default: 'BankAvenir - Votre banque en ligne',
    template: '%s | BankAvenir'
  },
  description: 'BankAvenir, la banque en ligne nouvelle génération. 100% en ligne, 100% sécurisé, 0% frais cachés.',
  keywords: ['banque en ligne', 'compte bancaire', 'épargne', 'bourse', 'crédit immobilier', 'BankAvenir'],
  authors: [{ name: 'BankAvenir' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://bankavenir.com',
    siteName: 'BankAvenir',
    title: 'BankAvenir - Votre banque en ligne',
    description: 'BankAvenir, la banque en ligne nouvelle génération.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BankAvenir'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BankAvenir - Votre banque en ligne',
    description: 'BankAvenir, la banque en ligne nouvelle génération.',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
};

type Props = {
  children: React.ReactNode;
  params : Promise<{locale: string}>;
}

export default async function LocaleLayout({children, params}: Props) {

  const {locale} = await params;
  if(!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
      <NextIntlClientProvider locale={locale} messages={messagesMap[locale]}>
        <LocaleProvider>
        <AuthProvider>
          <ReactQueryProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ReactQueryProvider>
        </AuthProvider>
        </LocaleProvider>
      </NextIntlClientProvider>

      </body>
    </html>
  );
}
