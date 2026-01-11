"use client";

import { Link } from "@/i18n/navigation";
import { Landmark, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('landing.header');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Landmark className="text-white" size={20} />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
              BankAvenir
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
            <Link href="/services" className="text-gray-600 hover:text-blue-600 transition font-medium whitespace-nowrap">
              {t('services')}
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition font-medium whitespace-nowrap">
              {t('about')}
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-blue-600 transition font-medium whitespace-nowrap">
              {t('help')}
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition font-medium whitespace-nowrap">
              {t('contact')}
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
            <LanguageSwitcher />
            <Link href="/login" className="px-4 xl:px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition whitespace-nowrap">
              {t('login')}
            </Link>
            <Link href="/register" className="px-4 xl:px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-medium whitespace-nowrap">
              {t('openAccount')}
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-600 hover:text-blue-600 transition flex-shrink-0"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-4">
            <Link href="/services" className="block text-gray-600 hover:text-blue-600 transition font-medium">
              {t('services')}
            </Link>
            <Link href="/about" className="block text-gray-600 hover:text-blue-600 transition font-medium">
              {t('about')}
            </Link>
            <Link href="/help" className="block text-gray-600 hover:text-blue-600 transition font-medium">
              {t('help')}
            </Link>
            <Link href="/contact" className="block text-gray-600 hover:text-blue-600 transition font-medium">
              {t('contact')}
            </Link>
            <LanguageSwitcher />
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/login" className="px-6 py-2 text-center text-blue-600 hover:text-blue-700 font-medium transition border border-blue-600 rounded-xl">
                {t('login')}
              </Link>
              <Link href="/register" className="px-6 py-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium">
                {t('openAccount')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}