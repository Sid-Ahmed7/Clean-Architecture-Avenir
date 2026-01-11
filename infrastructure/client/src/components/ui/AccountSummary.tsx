"use client";

import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { useTranslations } from 'next-intl';

interface AccountSummaryProps {
    account: AccountModel;
}

export function AccountSummary({ account }: AccountSummaryProps) {
    const t = useTranslations('components.accountSummary');
    const blockedBalance = account.blockedBalanced ?? 0;
    const availableBalance = account.currentBalance - blockedBalance;
    const blockedPercentage = account.currentBalance > 0
        ? (blockedBalance / account.currentBalance) * 100
        : 0;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">{t('title')}</h2>

            <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex mb-4">
                <div
                    className="bg-green-500 h-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${100 - blockedPercentage}%` }}
                >
                    {availableBalance > 0 && availableBalance >= 100 && `${availableBalance.toFixed(0)}€`}
                </div>
                {blockedBalance > 0 && (
                    <div
                        className="bg-orange-500 h-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{ width: `${blockedPercentage}%` }}
                    >
                        {blockedBalance >= 100 && `${blockedBalance.toFixed(0)}€`}
                    </div>
                )}
            </div>

            <div className="flex justify-between gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-700">
                        {t('available')} <span className="font-semibold">({availableBalance.toFixed(2)} {account.currency})</span>
                    </span>
                </div>
                {blockedBalance > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-gray-700">
                            {t('blocked')} <span className="font-semibold">({blockedBalance.toFixed(2)} {account.currency})</span>
                        </span>
                    </div>
                )}
            </div>

            {blockedBalance > 0 && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                        <span className="font-semibold">{blockedBalance.toFixed(2)} {account.currency}</span> {t('blockedInfo')}
                    </p>
                </div>
            )}
        </div>
    );
}
