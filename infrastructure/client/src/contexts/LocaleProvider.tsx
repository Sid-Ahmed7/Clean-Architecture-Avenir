"use client";

import { useLocale } from "next-intl";
import { createContext, useEffect, useState } from "react";


export const LocaleContext = createContext<{
  locale: string;
  setLocale: (locale: string) => void;
}>({
  locale: "fr", 
  setLocale: () => {},
});
export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const nextLocale = useLocale();
  const [locale, setLocale] = useState<string>(nextLocale || "fr");

  useEffect(() => {
    setLocale(nextLocale || "fr");
  }, [nextLocale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}