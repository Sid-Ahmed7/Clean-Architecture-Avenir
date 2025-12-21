interface InfoStepProps {
    stepNumber: number;
    title: string;
    description: string;
}

export function InfoStep({ stepNumber, title, description }: InfoStepProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 font-bold text-xs">{stepNumber}</span>
            </div>
            <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
}
