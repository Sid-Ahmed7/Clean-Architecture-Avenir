import { useTranslations } from "next-intl";

export function MentionsLegalesContent() {
  const t = useTranslations("pages.legal.mentions");

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{t("title")}</h1>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("sections.editor.title")}</h2>
          <p>
            {t("sections.editor.company")}<br />
            {t("sections.editor.capital")}<br />
            {t("sections.editor.headquarters")}<br />
            {t("sections.editor.rcs")}<br />
            {t("sections.editor.siret")}<br />
            {t("sections.editor.ape")}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("sections.director.title")}</h2>
          <p>{t("sections.director.name")}</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("sections.banking.title")}</h2>
          <p>
            {t("sections.banking.content")}
          </p>
        </div>
      </div>
    </div>
  );
}
