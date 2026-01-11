import { Metadata } from "next";
import { MentionsLegalesContent } from "@/components/landing/legal/MentionsLegalesContent";
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.legal.mentions' });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false }
  };
}

export default function MentionsLegalesPage() {
  return <MentionsLegalesContent />;
}