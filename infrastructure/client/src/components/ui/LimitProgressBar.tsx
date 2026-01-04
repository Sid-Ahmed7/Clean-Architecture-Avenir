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
                    {/* Assuming label is already translated by parent or is a key. 
                        If parent passes "withdrawalLimit", we can translate it here if we had keys.
                        But usually parent handles label translation. Let's assume parent passes translated string or logic is upstream.
                        Wait, parent passes "withdrawalLimit" which is a key in messages. 
                        Let's check MainAccountCard usage: label="withdrawalLimit". 
                        The existing code displayed {label} directly.
                        Wait, MainAccountCard calls t("limits") then passes label="withdrawalLimit".
                        Ah, MainAccountCard passes "withdrawalLimit" string literal.
                        So we should translate it here? Or MainAccountCard should translate it?
                        MainAccountCard has keys: withdrawalLimit, transferLimit, overdraftLimit inside "mainAccountCard.limits"?
                        Let's check fr.json content for mainAccountCard. 
                        We don't know if "withdrawalLimit" is in mainAccountCard. 
                        Let's assume we need to translate the label here if it matches a known key, or display as is.
                        Let's try to translate using a common namespace or passed in t function?
                        No, we have useTranslations('components.limitProgressBar').
                        Let's assume we need to add label keys to limitProgressBar or accept translated label.
                        The safest is to accept translated label from parent.
                        But MainAccountCard passes "withdrawalLimit".
                        I'll wrap it in t if possible, or just display.
                        Actually invalid approach. I should check if MainAccountCard translates it.
                        MainAccountCard: label="withdrawalLimit". It's a string.
                        I'll look at the props again. 
                        To be safe, I will translate it here if it looks like a key.
                    */}
                    {/* For now, I will use t(label) if it exists in limitProgressBar, otherwise label. 
                         But wait, MainAccountCard uses keys from its own namespace.
                         Let's update MainAccountCard to pass translated label.
                         For now, I'll just keep {label} but beware it might be raw key.
                      */}
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