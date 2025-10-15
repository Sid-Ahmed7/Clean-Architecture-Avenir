"use client";

import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { useTranslations } from "next-intl";
import { LimitProgressBar } from "../ui/LimitProgressBar";
import { CreditCard } from "lucide-react";

interface  MainAccountCardProps {
    account : AccountModel;
}

export function MainAccountCard(props : MainAccountCardProps) {

    const {account} = props;
    const t = useTranslations();
    return (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard className="w-5 h-5" />
                                    <h3 className="font-bold text-lg">
                                        {account.customAccountName || `Compte ${account.accountNumber}`}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                                        Principal
                                    </span>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        account.isActive && account.accountStatus === 'ACTIVE'
                                            ? 'bg-green-400/90 text-green-900' 
                                            : 'bg-red-400/90 text-red-900'
                                    }`}>
                                        {account.accountStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-white/80 font-medium">Solde disponible</p>
                            <p className="text-4xl font-bold tracking-tight">
                            {account.currentBalance.toLocaleString('fr-FR')}
                            <span className="text-2xl">{account.currency}</span>

                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Numéro de compte</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {account.accountNumber.toString().padStart(11, '0')}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium mb-1">IBAN</p>
                                <p className="text-sm font-mono font-semibold text-gray-900">
                                    {account.iban}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                            <h4 className="text-sm font-bold text-gray-900">Limites</h4>
                        </div>
                        
                        <LimitProgressBar
                            label="withdrawalLimit"
                            value={0} 
                            max={account.withdrawalLimit}
                            currency={account.currency}
                        />
                        <LimitProgressBar
                            label="transferLimit"
                            value={0}
                            max={account.transferLimit}
                            currency={account.currency}
                        />
                        <LimitProgressBar
                            label="overdraftLimit"
                            value={0}
                            max={account.overdraftLimit}
                            currency={account.currency}
                        />
                    </div>
                </div>
            </div>
        );
    }