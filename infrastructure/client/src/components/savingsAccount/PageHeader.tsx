import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
}

export function PageHeader({ title, subtitle, showBackButton = true }: PageHeaderProps) {
    const t = useTranslations("components.savingsAccount.pageHeader");
    const router = useRouter();

    return (
        <div className="mb-6">
            {showBackButton && (
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">{t("back")}</span>
                </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
            </h1>
            {subtitle && (
                <p className="text-gray-600">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
