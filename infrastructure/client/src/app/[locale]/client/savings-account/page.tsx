"use client";

import { SavingsAccountCard, PageHeader, SavingsInfoSection } from "@/components/savingsAccount";

export default function SavingsAccountPage() {
    // TODO: Get the actual account number from the user's account
    // For now, using a placeholder
    const accountNumber = 123456;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <PageHeader
                    title="Mon Compte Épargne"
                    subtitle="Consultez vos intérêts et suivez l'évolution de votre épargne"
                />

                {/* Savings Account Card */}
                <SavingsAccountCard accountNumber={accountNumber} />

                {/* Additional Info */}
                <SavingsInfoSection />
            </div>
        </div>
    );
}
