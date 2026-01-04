import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { useTranslations, useFormatter } from "next-intl";

interface AccountProps {
    accounts: AccountModel[];
    mainAccountId?: number;
}

export function AccountCard({ account }: { account: AccountModel }) {
    const tEnums = useTranslations("components.enums");
    const format = useFormatter();
    const blockedBalance = account.blockedBalanced ?? 0;
    const availableBalance = account.currentBalance - blockedBalance;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                            {account.customAccountName || `Compte ${account.accountNumber}`}
                        </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                        {account.accountNumber.toString().padStart(11, '0')}
                    </p>
                </div>
            </div>

            <div className="mb-2">
                <p className="text-sm text-gray-500 mb-1">Solde total</p>
                <p className="text-2xl font-bold text-gray-900">
                    {format.number(account.currentBalance, { style: 'currency', currency: account.currency })}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700 mb-1">Disponible</p>
                    <p className="text-lg font-semibold text-green-800">
                        {format.number(availableBalance, { style: 'currency', currency: account.currency })}
                    </p>
                </div>

                {blockedBalance > 0 && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-orange-700 mb-1">Bloqué</p>
                        <p className="text-lg font-semibold text-orange-800">
                            {format.number(blockedBalance, { style: 'currency', currency: account.currency })}
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">IBAN</span>
                <span className="text-gray-900 font-medium">{account.iban}</span>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Type: {account.accountType}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${account.isActive && account.accountStatus === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                    {tEnums(`accountStatus.${account.accountStatus}`)}
                </span>
            </div>
        </div>
    );
}