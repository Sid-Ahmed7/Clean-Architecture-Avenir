import { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/landing/legal/PrivacyPolicyContent";
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.legal.privacy' });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false }
  };
}

export default function ConfidentialitePage() {
  return <PrivacyPolicyContent />;
}