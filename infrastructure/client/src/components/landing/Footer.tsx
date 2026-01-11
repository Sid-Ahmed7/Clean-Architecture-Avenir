"use client";

import { Link } from "@/i18n/navigation";
import { Landmark } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('landing.footer');
 return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Landmark className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold text-white">BankAvenir</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{t('tagline')}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('company.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">{t('company.about')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('help.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white transition">{t('help.helpCenter')}</Link></li>
              <li><Link href="/legal/mentions-legales" className="hover:text-white transition">{t('help.legal')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">{t('help.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/legal/mentions-legales" className="hover:text-white transition">{t('legalLinks.legal')}</Link>
            <Link href="/legal/confidentialite" className="hover:text-white transition">{t('legalLinks.privacy')}</Link>
            <Link href="/legal/cgv" className="hover:text-white transition">{t('legalLinks.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}