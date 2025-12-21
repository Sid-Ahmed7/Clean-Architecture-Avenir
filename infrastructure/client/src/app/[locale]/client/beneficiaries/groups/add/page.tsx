"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { GroupForm } from "@/components/beneficiaries/group/form/GroupForm";
import { useBeneficiaries } from "@/hooks/useBeneficiaries";
import { useBeneficiaryGroupMutations } from "@/hooks/useBeneficiaryGroups";
import { CreateBeneficiaryGroupRequest } from "@/types/beneficiaryGroup";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { LocaleContext } from "@/contexts/LocaleProvider";

export default function AddBeneficiaryGroupPage() {
  const router = useRouter();
    const {locale} = useContext(LocaleContext);
  
  const { data: beneficiaries, isLoading: isLoadingBeneficiaries } = useBeneficiaries();
  const { createBeneficiaryGroup } = useBeneficiaryGroupMutations();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: CreateBeneficiaryGroupRequest) => {
    setError(null);

    const result = await createBeneficiaryGroup.mutateAsync(data);

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

      {!isLoadingBeneficiaries && (
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
              Créer un groupe de bénéficiaires
            </h1>
            <p className="text-gray-600 mt-2">
              Organisez vos bénéficiaires en groupes pour faciliter les transferts multiples
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
                Groupe créé avec succès! Redirection...
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <GroupForm
              beneficiaries={beneficiaries || []}
              onSubmit={handleSubmit}
              isLoading={createBeneficiaryGroup.isPending}
            />
          </div>
        </div>
      )}
    </>
  );
}
