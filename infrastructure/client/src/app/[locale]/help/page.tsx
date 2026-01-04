import { Link } from "@/i18n/navigation";
import { Headset, HelpCircle, Search, Shield } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.help' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
    }
  };
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing.help' });

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition">
              <HelpCircle className="text-blue-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('sections.faq.title')}</h3>
              <p className="text-gray-600 mb-4">{t('sections.faq.description')}</p>
              <a href="#faq" className="text-blue-600 hover:text-blue-700 font-semibold">
                {t('sections.faq.link')} →
              </a>
            </div>

            <div id="security" className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition">
              <Shield className="text-emerald-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('sections.security.title')}</h3>
              <p className="text-gray-600 mb-4">{t('sections.security.description')}</p>
              <Link href="#security" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                {t('sections.security.link')} →
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition">
              <Headset className="text-purple-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('sections.support.title')}</h3>
              <p className="text-gray-600 mb-4">{t('sections.support.description')}</p>
              <Link href="/contact" className="text-purple-600 hover:text-purple-700 font-semibold">
                {t('sections.support.link')} →
              </Link>
            </div>
          </div>

          <div id="faq" className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              {t('faqTitle')}
            </h2>
            <div className="space-y-6">
              {t.raw('faqs').map((faq: { question: string; answer: string }, index: number) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
