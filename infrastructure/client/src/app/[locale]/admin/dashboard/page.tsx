"use client";

import { Shield, UserCog, Settings, PiggyBank, Activity } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-white p-6 mx-auto space-y-8">
            {/* Welcome message */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
            </div>

            {/* Admin specific content */}
            <section className="space-y-6">
                {/* Admin Header */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Administration Système</h2>
                    </div>
                    <p className="text-gray-700 ml-14">Gestion complète du système bancaire</p>
                </div>

                {/* Admin Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Management */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UserCog className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Gestion des Utilisateurs</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Créez et gérez les gestionnaires bancaires.
                        </p>
                        <div className="space-y-2">
                            <Link href="/admin/create-manager">
                                <Button variant="primary" fullWidth icon={UserCog} size="sm">
                                    Créer un gestionnaire
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* System Settings */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Settings className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Paramètres Système</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Configurez les paramètres globaux.
                        </p>
                        <div className="space-y-2">
                            <Link href="/admin/system-settings">
                                <Button variant="secondary" fullWidth icon={Settings} size="sm">
                                    Paramètres système
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Savings Management */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <PiggyBank className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Comptes Épargne</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Gérez les comptes épargne du système.
                        </p>
                        <div className="space-y-2">
                            <Link href="/admin/manage-savings">
                                <Button variant="success" fullWidth icon={PiggyBank} size="sm">
                                    Gestion épargne
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Activity className="w-5 h-5 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Statistiques</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Vue d'ensemble du système.
                        </p>
                        <div className="text-center py-4">
                            <p className="text-xs text-gray-400">Bientôt disponible</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
