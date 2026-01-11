"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";

const locales = [
  { code: "fr", label: "FR", country: "FR" },
  { code: "en", label: "EN", country: "GB" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const currentLocale = pathname?.split("/")[1] || "fr";
  const current = locales.find(l => l.code === currentLocale)!;

  const changeLanguage = (code: string) => {
    const segments = pathname?.split("/") || [];
    segments[1] = code;
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white shadow-sm hover:bg-gray-50 transition"
      >
        <ReactCountryFlag svg countryCode={current.country} className="w-5 h-5" />
        <span className="font-medium">{current.label}</span>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
          {locales.map(locale => (
            <button
              key={locale.code}
              onClick={() => changeLanguage(locale.code)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100 transition ${
                locale.code === currentLocale ? "bg-gray-50 font-semibold" : ""
              }`}
            >
              <ReactCountryFlag
                svg
                countryCode={locale.country}
                className="w-5 h-5"
              />
              {locale.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
