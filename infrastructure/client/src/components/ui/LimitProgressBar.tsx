"use client";

import { useTranslations } from 'next-intl';

interface LimitProgressBarProps {
    label: string;
    value: number;
    max: number;
    currency?: string;
}

export function LimitProgressBar({ label, value, max, currency }: LimitProgressBarProps) {
    const t = useTranslations('components.limitProgressBar');
    const percentage = Math.min((value / max) * 100, 100);

    const isNearLimit = percentage > 80;
    const isMedium = percentage > 50 && percentage <= 80;
    const isLow = percentage <= 50;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                    {label}
                </span>
                <div className="text-right">
                    <span className={`text-sm font-bold ${isNearLimit ? 'text-red-600' :
                            isMedium ? 'text-orange-600' :
                                'text-gray-900'
                        }`}>
                        {value.toLocaleString()} / {max.toLocaleString()} {currency}
                    </span>
                </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-2.5 rounded-full transition-all duration-500 ease-out ${isNearLimit
                            ? 'bg-gradient-to-r from-red-500 to-red-600'
                            : isMedium
                                ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex justify-between items-center">
                <span className={`text-xs font-medium ${isNearLimit ? 'text-red-600' :
                        isMedium ? 'text-orange-600' :
                            'text-gray-500'
                    }`}>
                    {isNearLimit && t('nearLimit')}
                    {isMedium && t('attention')}
                    {isLow && t('available')}
                </span>
                <span className="text-xs text-gray-500">
                    {(max - value).toLocaleString()} {currency} {t('remaining')}
                </span>
            </div>
        </div>
    );
}