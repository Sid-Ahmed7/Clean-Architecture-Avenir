import { useTranslations } from "next-intl";

export function CGVContent() {
  const t = useTranslations("pages.legal.cgv");

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{t("title")}</h1>

          <p className="text-gray-600 mb-6">{t("effectiveDate", { date: new Date().toLocaleDateString() })}</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("sections.purpose.title")}</h2>
          <p>
            {t("sections.purpose.content")}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("sections.accountOpening.title")}</h2>
          <p>
            {t("sections.accountOpening.content")}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("sections.pricing.title")}</h2>
          <p>
            {t("sections.pricing.content")}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("sections.termination.title")}</h2>
          <p>
            {t("sections.termination.content")}
          </p>
        </div>
      </div>
    </div>
  );
}
