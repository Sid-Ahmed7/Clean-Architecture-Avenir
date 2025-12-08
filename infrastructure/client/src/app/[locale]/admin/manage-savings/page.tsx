"use client";

import { useState } from "react";
import { CreateSavingsAccountForm, ManageSavingsAccountForm, TriggerInterestCalculation } from "@/components/savingsAccount";
import { ArrowLeft, PlusCircle, Settings, Calculator } from "lucide-react";
import { useRouter } from "next/navigation";

type ViewMode = 'menu' | 'create' | 'manage' | 'calculate';

export default function ManageSavingsPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>('menu');
    const [selectedAccountNumber, setSelectedAccountNumber] = useState<number | null>(null);

    const handleManageAccount = (accountNumber: number) => {
        setSelectedAccountNumber(accountNumber);
        setViewMode('manage');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => viewMode === 'menu' ? router.back() : setViewMode('menu')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">
                            {viewMode === 'menu' ? 'Retour' : 'Retour au menu'}
                        </span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Gestion des Comptes Épargne
                    </h1>
                    <p className="text-gray-600">
                        Créer, modifier et gérer les comptes épargne
                    </p>
                </div>

                {/* Content */}
                {viewMode === 'menu' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Create Card */}
                        <button
                            onClick={() => setViewMode('create')}
                            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-[1.02] text-left group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <PlusCircle className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Créer un Compte Épargne
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Créer un nouveau compte épargne avec taux et plafond personnalisés
                            </p>
                        </button>

                        {/* Manage Card */}
                        <button
                            onClick={() => {
                                // TODO: Show account selection modal
                                // For demo, using a placeholder account number
                                handleManageAccount(123456);
                            }}
                            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-[1.02] text-left group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Settings className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Gérer un Compte
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Modifier les taux, plafonds et paramètres d'un compte existant
                            </p>
                        </button>

                        {/* Calculate Card */}
                        <button
                            onClick={() => setViewMode('calculate')}
                            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-[1.02] text-left group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calculator className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Calculer les Intérêts
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Déclencher manuellement le calcul quotidien des intérêts
                            </p>
                            <span className="inline-block mt-3 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                BANK_MANAGER uniquement
                            </span>
                        </button>
                    </div>
                )}

                {viewMode === 'create' && (
                    <div className="max-w-2xl mx-auto">
                        <CreateSavingsAccountForm
                            onSuccess={() => setViewMode('menu')}
                            onCancel={() => setViewMode('menu')}
                        />
                    </div>
                )}

                {viewMode === 'manage' && selectedAccountNumber && (
                    <div className="max-w-2xl mx-auto">
                        <ManageSavingsAccountForm
                            accountNumber={selectedAccountNumber}
                            onSuccess={() => setViewMode('menu')}
                            onCancel={() => setViewMode('menu')}
                        />
                    </div>
                )}

                {viewMode === 'calculate' && (
                    <div className="max-w-2xl mx-auto">
                        <TriggerInterestCalculation />
                    </div>
                )}

                {/* Info Section (only in menu) */}
                {viewMode === 'menu' && (
                    <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            📋 Guide de gestion
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Création de compte</h3>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Définir le taux d'intérêt annuel (0-100%)</li>
                                    <li>• Optionnel : Plafond de rémunération</li>
                                    <li>• Optionnel : Date d'échéance</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Modification</h3>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Ajuster le taux d'intérêt</li>
                                    <li>• Modifier le plafond</li>
                                    <li>• Activer/désactiver le compte</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Calcul des intérêts</h3>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Formule : min(solde, plafond) × (taux / 365 / 100)</li>
                                    <li>• Automatique via cron (recommandé)</li>
                                    <li>• Manuel pour tests/urgences</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Bonnes pratiques</h3>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Vérifier les taux avant validation</li>
                                    <li>• Documenter les modifications</li>
                                    <li>• Surveiller les calculs quotidiens</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
