"use client";

import { Link } from "@/i18n/navigation";

export default function AdvisorDashboard() {
    return (
        <div className="min-h-screen bg-white p-6 mx-auto space-y-8">
            {/* Welcome message */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord conseiller bancaire</h1>
            </div>

            {/* Advisor specific content */}
            <section className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion des clients</h2>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-700">Accédez à la liste de vos clients et gérez leurs comptes.</p>
                    <Link href="/clients">
                        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Voir mes clients
                        </button>
                    </Link>
                </div>
            </section>

            <section className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Demandes de découvert</h2>
                <div className="bg-white p-4 rounded-lg shadow flex flex-col gap-3">
                    <p className="text-gray-700">Consulte et traite les demandes d’augmentation de découvert.</p>
                    <Link href="/advisor/overdraft-requests">
                        <button className="w-fit bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                            Ouvrir les demandes de découvert
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
