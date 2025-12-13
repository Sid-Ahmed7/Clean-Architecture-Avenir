import { InfoStep } from "./InfoStep";

interface SavingsInfoSectionProps {
    title?: string;
}

export function SavingsInfoSection({ title = "Comment fonctionne votre compte épargne ?" }: SavingsInfoSectionProps) {
    const steps = [
        {
            title: "Calcul quotidien",
            description: "Vos intérêts sont calculés chaque jour sur votre solde disponible"
        },
        {
            title: "Crédit automatique",
            description: "Les intérêts sont automatiquement ajoutés à votre compte"
        },
        {
            title: "Effet cumulatif",
            description: "Vos intérêts génèrent eux-mêmes des intérêts (intérêts composés)"
        }
    ];

    return (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
                {title}
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
