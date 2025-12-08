"use client";

import { SavingsAccountCard } from "@/components/savingsAccount";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SavingsAccountPage() {
    const router = useRouter();

    // TODO: Get the actual account number from the user's account
    // For now, using a placeholder
    const accountNumber = 123456;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Retour</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Mon Compte Épargne
                    </h1>
                    <p className="text-gray-600">
                        Consultez vos intérêts et suivez l'évolution de votre épargne
                    </p>
                </div>

                {/* Savings Account Card */}
                <SavingsAccountCard accountNumber={accountNumber} />

                {/* Additional Info */}
                <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        Comment fonctionne votre compte épargne ?
                    </h2>
                    <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-emerald-600 font-bold text-xs">1</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Calcul quotidien</p>
                                <p className="text-gray-600">
                                    Vos intérêts sont calculés chaque jour sur votre solde disponible
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-emerald-600 font-bold text-xs">2</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Crédit automatique</p>
                                <p className="text-gray-600">
                                    Les intérêts sont automatiquement ajoutés à votre compte
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-emerald-600 font-bold text-xs">3</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Effet cumulatif</p>
                                <p className="text-gray-600">
                                    Vos intérêts génèrent eux-mêmes des intérêts (intérêts composés)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
