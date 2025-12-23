"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { BeneficiaryForm } from "@/components/beneficiaries/form/BeneficiaryForm";
import { useBeneficiaries, useBeneficiaryMutations } from "@/hooks/useBeneficiaries";
import { UpdateBeneficiaryRequest } from "@/types/beneficiary";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { LocaleContext } from "@/contexts/LocaleProvider";

export default function EditBeneficiaryPage() {
  const router = useRouter();
  const params = useParams();
  const beneficiaryId = params.beneficiaryId as string;
  const {locale} = useContext(LocaleContext);

  const { data: beneficiaries, isLoading: isLoadingBeneficiaries } = useBeneficiaries();
  const { updateBeneficiary } = useBeneficiaryMutations();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const beneficiary = beneficiaries?.find((b) => b.beneficiaryId === beneficiaryId);

  useEffect(() => {
    if (!isLoadingBeneficiaries && !beneficiary) {
      setError("Bénéficiaire non trouvé");
    }
  }, [isLoadingBeneficiaries, beneficiary]);

  const handleSubmit = async (data: UpdateBeneficiaryRequest) => {
    setError(null);

    const result = await updateBeneficiary.mutateAsync({beneficiaryId,beneficiary: data});

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
    <>
      {isLoadingBeneficiaries && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {!isLoadingBeneficiaries && !beneficiary && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 text-lg">
              Bénéficiaire non trouvé
            </p>
            <Link
              href={`/${locale}/client/beneficiaries`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux bénéficiaires
            </Link>
          </div>
        </div>
      )}

      {!isLoadingBeneficiaries && beneficiary && (
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
              Modifier le bénéficiaire
            </h1>
            <p className="text-gray-600 mt-2">
              Modifiez les informations de {beneficiary.beneficiaryName}
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
                Bénéficiaire modifié avec succès! Redirection...
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <BeneficiaryForm
              initialData={{
                beneficiaryName: beneficiary.beneficiaryName,
                iban: beneficiary.iban,
                email: beneficiary.email,
                country: beneficiary.country,
                address: beneficiary.address,
              }}
              onSubmit={handleSubmit}
              isLoading={updateBeneficiary.isPending}
            />
          </div>
        </div>
      )}
    </>
  );
}
