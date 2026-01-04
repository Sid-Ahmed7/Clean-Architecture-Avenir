import { InfoStep } from "./InfoStep";
import { useTranslations } from "next-intl";

interface SavingsInfoSectionProps {
    title?: string;
}

export function SavingsInfoSection({ title }: SavingsInfoSectionProps) {
    const t = useTranslations("components.savingsAccount.info");
    
    const steps = [
        {
            title: t("dailyCalculation.title"),
            description: t("dailyCalculation.description")
        },
        {
            title: t("autoCredit.title"),
            description: t("autoCredit.description")
        },
        {
            title: t("compoundEffect.title"),
            description: t("compoundEffect.description")
        }
    ];

    return (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
                {title || t("defaultTitle")}
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
                {steps.map((step, index) => (
                    <InfoStep
                        key={index}
                        stepNumber={index + 1}
                        title={step.title}
                        description={step.description}
                    />
                ))}
            </div>
        </div>
    );
}
