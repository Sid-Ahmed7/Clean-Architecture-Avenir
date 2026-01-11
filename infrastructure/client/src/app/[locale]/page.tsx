import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Metadata } from 'next';
import Hero from '@/components/landing/Hero';
import CTA from '@/components/landing/CTA';
import Features from '@/components/landing/Feature';
import Services from '@/components/landing/Services';
import Stats from '@/components/landing/Stats';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
    }
  };
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Features />
      <Services />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}
