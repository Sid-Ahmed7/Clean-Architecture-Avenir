import { Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import ContactForm from "@/components/landing/contact/ContactForm";

type Props = {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.contact' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
    }
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing.contact' });

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('methods.phone.title')}</h3>
              <p className="text-gray-600 mb-2">{t('methods.phone.availability')}</p>
              <a href="tel:+33123456789" className="text-blue-600 hover:text-blue-700 font-semibold">
                {t('methods.phone.number')}
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('methods.email.title')}</h3>
              <p className="text-gray-600 mb-2">{t('methods.email.availability')}</p>
              <a href="mailto:contact@bankavenir.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                {t('methods.email.address')}
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('methods.address.title')}</h3>
              <p className="text-gray-600">
                {t('methods.address.street')}<br />
                {t('methods.address.city')}
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('form.title')}
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
