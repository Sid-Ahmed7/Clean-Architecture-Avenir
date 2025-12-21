"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { TransferToBeneficiaryForm } from "@/components/beneficiaries/form/TransferToBeneficiaryForm";
import { useBeneficiaries, useBeneficiaryMutations } from "@/hooks/useBeneficiaries";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { TransferToBeneficiaryRequest } from "@/types/transfer";
import { LocaleContext } from "@/contexts/LocaleProvider";

export default function TransferToBeneficiaryPage() {
  const router = useRouter();
  const params = useParams();
  const beneficiaryId = params.beneficiaryId as string;
  const {locale} = useContext(LocaleContext);

  const { data: beneficiaries, isLoading: isLoadingBeneficiaries } = useBeneficiaries();
  const { transferToBeneficiary } = useBeneficiaryMutations();
  const [error, setError] = useState<string | null>(null);

  const beneficiary = beneficiaries?.find((b) => b.beneficiaryId === beneficiaryId);

  useEffect(() => {
    if (!isLoadingBeneficiaries && !beneficiary) {
      setError("Bénéficiaire non trouvé");
    }
  }, [isLoadingBeneficiaries, beneficiary]);

  useEffect(() => {
    if (transferToBeneficiary.isSuccess && transferToBeneficiary.data?.data) {
      router.push(`/${locale}/client/beneficiaries`);
    }
  }, [transferToBeneficiary.isSuccess, transferToBeneficiary.data, router, locale]);

  useEffect(() => {
    if (transferToBeneficiary.data?.error) {
      setError(transferToBeneficiary.data.error);
    }
  }, [transferToBeneficiary.data?.error]);

  const handleSubmit = async (data: TransferToBeneficiaryRequest) => {
    setError(null);
    transferToBeneficiary.mutate(data);
  };

  const handleCancel = () => {
    router.push(`/${locale}/client/beneficiaries`);
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
              href="/client/beneficiaries"
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
              href="/client/beneficiaries"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux bénéficiaires
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Effectuer un transfert
            </h1>
            <p className="text-gray-600 mt-2">
              Envoyez de l&apos;argent à {beneficiary.beneficiaryName}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <TransferToBeneficiaryForm
              beneficiary={beneficiary}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </>
  );
}
