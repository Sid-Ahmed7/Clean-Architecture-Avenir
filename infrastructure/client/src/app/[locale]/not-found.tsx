import { Home, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center px-6">
      <div className="text-center text-white">
        <div className="mb-8">
          <div className="text-9xl font-bold mb-4">404</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-md mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <Home size={20} /> {t("backHome")}
          </Link>
          <Link href="/help" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
            <Search size={20} /> {t("helpCenter")}
          </Link>
        </div>

        <div className="mt-12 text-blue-100">
          <p>{t("needHelp")} <Link href="/contact" className="underline hover:text-white">{t("contactUs")}</Link></p>
        </div>
      </div>
    </div>
  );
}