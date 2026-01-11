import { Award, Leaf, Shield, Users } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.about' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
    }
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing.about' });

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('history.title')}</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                {t('history.paragraph1')}
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t('history.paragraph2')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t('history.paragraph3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('values.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <Users className="text-blue-600 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('values.clientFirst.title')}</h3>
              <p className="text-gray-600">
                {t('values.clientFirst.description')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <Shield className="text-emerald-600 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('values.transparency.title')}</h3>
              <p className="text-gray-600">
                {t('values.transparency.description')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <Leaf className="text-green-600 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('values.responsibility.title')}</h3>
              <p className="text-gray-600">
                {t('values.responsibility.description')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <Award className="text-purple-600 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('values.excellence.title')}</h3>
              <p className="text-gray-600">
                {t('values.excellence.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
