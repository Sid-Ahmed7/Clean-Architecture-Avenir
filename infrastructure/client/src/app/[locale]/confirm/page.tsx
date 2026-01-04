
"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api/apiClient";
import { LocaleContext } from "@/contexts/LocaleProvider";

import { useTranslations } from "next-intl";


export default function ConfirmPage() {
  const t = useTranslations('auth.confirm');
  const { locale } = useContext(LocaleContext);
  const [message, setMessage] = useState(t('waiting'));
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    if (!pathname.startsWith(`/${locale}`)) {
      router.replace(`/${locale}/confirm?${searchParams.toString()}`);
      return;
    }



    const token = searchParams.get('token');
    if (!token) {
      return
    }

    apiClient.get(`/auth/confirm?token=${token}`).then((res) => {
      if (res.status === 200) {
        setMessage(t('success'));
        setTimeout(() => router.push(`/${locale}/login`), 3000)
      }
    });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-200 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
          {t('title')}
        </h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}