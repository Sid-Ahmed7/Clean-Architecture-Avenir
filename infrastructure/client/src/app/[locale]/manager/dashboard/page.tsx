"use client";

import { UserCog, Settings, Briefcase } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export default function ManagerDashboard() {
    return (
        <div className="min-h-screen bg-white p-6 mx-auto space-y-8">
            {/* Welcome message */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord gestionnaire</h1>
            </div>

            {/* Manager specific content */}
            <section className="space-y-6">
                {/* Manager Header */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Gestion de l'Agence</h2>
                    </div>
                    <p className="text-gray-700 ml-14">Administration des conseillers et paramètres de l'agence</p>
                </div>

                {/* Manager Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Advisor Management */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UserCog className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Gestion des Conseillers</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Créez et gérez les conseillers bancaires de votre agence.
                        </p>
                        <div className="space-y-2">
                            <Link href="/manager/create-advisor">
                                <Button variant="primary" fullWidth icon={UserCog} size="sm">
                                    Créer un conseiller
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Agency Settings */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Settings className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Paramètres de l'Agence</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Configurez les paramètres de votre agence.
                        </p>
                        <div className="space-y-2">
                            <Link href="/manager/agency-settings">
                                <Button variant="secondary" fullWidth icon={Settings} size="sm">
                                    Paramètres agence
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
