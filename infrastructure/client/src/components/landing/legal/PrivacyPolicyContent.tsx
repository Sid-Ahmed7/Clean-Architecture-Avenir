import { useTranslations } from "next-intl";

export function PrivacyPolicyContent() {
  const t = useTranslations("pages.legal.privacy");

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{t("title")}</h1>

          <p className="text-gray-600 mb-6">{t("lastUpdate", { date: new Date().toLocaleDateString() })}</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("sections.dataCollection.title")}</h2>
          <p>
            {t("sections.dataCollection.intro")}
          </p>
          <ul>
            <li>{t("sections.dataCollection.items.identity")}</li>
            <li>{t("sections.dataCollection.items.contact")}</li>
            <li>{t("sections.dataCollection.items.financial")}</li>
            <li>{t("sections.dataCollection.items.connection")}</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("sections.dataUsage.title")}</h2>
          <p>
            {t("sections.dataUsage.intro")}
          </p>
          <ul>
            <li>{t("sections.dataUsage.items.accountManagement")}</li>
            <li>{t("sections.dataUsage.items.legalObligations")}</li>
            <li>{t("sections.dataUsage.items.serviceImprovement")}</li>
            <li>{t("sections.dataUsage.items.fraudPrevention")}</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("sections.rights.title")}</h2>
          <p>
            {t("sections.rights.intro")}
          </p>
          <ul>
            <li>{t("sections.rights.items.access")}</li>
            <li>{t("sections.rights.items.rectification")}</li>
            <li>{t("sections.rights.items.erasure")}</li>
            <li>{t("sections.rights.items.portability")}</li>
            <li>{t("sections.rights.items.opposition")}</li>
          </ul>

          <p className="mt-8">
            {t("contact.text")} <a href="mailto:dpo@bankavenir.com" className="text-blue-600 hover:text-blue-700">{t("contact.email")}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
