"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { BeneficiaryForm } from "@/components/beneficiaries/form/BeneficiaryForm";
import { useBeneficiaryMutations } from "@/hooks/useBeneficiaries";
import { CreateBeneficiaryRequest } from "@/types/beneficiary";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LocaleContext } from "@/contexts/LocaleProvider";

export default function AddBeneficiaryPage() {
  const router = useRouter();
  const {locale} = useContext(LocaleContext)
  const { createBeneficiary } = useBeneficiaryMutations();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: CreateBeneficiaryRequest) => {
    setError(null);

    const result = await createBeneficiary.mutateAsync(data);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/client/beneficiaries`);
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/${locale}/client/beneficiaries`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux bénéficiaires
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Ajouter un bénéficiaire
        </h1>
        <p className="text-gray-600 mt-2">
          Créez un nouveau bénéficiaire pour vos virements
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            Bénéficiaire créé avec succès! Redirection...
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <BeneficiaryForm
          onSubmit={handleSubmit}
          isLoading={createBeneficiary.isPending}
        />
      </div>
    </div>
  );
}
