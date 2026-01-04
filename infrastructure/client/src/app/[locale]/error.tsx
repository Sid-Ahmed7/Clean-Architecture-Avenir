"use client";

import { Home, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-pink-600 flex items-center justify-center px-6">
      <div className="text-center text-white">
        <div className="mb-8">
          <div className="text-9xl font-bold mb-4">500</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-orange-100 mb-8 max-w-md mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCw size={20} /> {t("retry")}
          </button>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
            <Home size={20} /> {t("backHome")}
          </Link>
        </div>

        {error.digest && (
          <div className="mt-8 text-orange-100 text-sm">
            <p>{t("errorCode")}: {error.digest}</p>
          </div>
        )}

        <div className="mt-12 text-orange-100">
          <p>{t("persistentProblem")} <Link href="/contact" className="underline hover:text-white">{t("contactSupport")}</Link></p>
        </div>
      </div>
    </div>
  );
}