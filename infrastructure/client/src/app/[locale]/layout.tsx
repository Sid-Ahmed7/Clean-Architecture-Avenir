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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = messagesMap[locale as keyof typeof messagesMap];
  const metadata = messages.metadata;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const localeCode = locale === 'fr' ? 'fr_FR' : 'en_US';

  return {
    title: {
      default: metadata.title,
      template: metadata.titleTemplate
    },
    description: metadata.description,
    keywords: metadata.keywords.split(', '),
    authors: [{ name: 'Arthur' }, { name: 'Sid-Ahmed' }, { name: 'Sofiane' }],
    openGraph: {
      type: 'website',
      locale: localeCode,
      url: `${baseUrl}/${locale}`,
      siteName: 'BankAvenir',
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      images: [
        {
          url: '/logo-bank.webp',
          width: 1200,
          height: 630,
          alt: 'BankAvenir'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.twitterTitle,
      description: metadata.twitterDescription,
      images: ['/logo-bank.webp']
    },
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'fr': `${baseUrl}/fr`,
        'en': `${baseUrl}/en`
      }
    }
  };
}

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
