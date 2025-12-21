"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { GroupForm } from "@/components/beneficiaries/group/form/GroupForm";
import { useBeneficiaries } from "@/hooks/useBeneficiaries";
import { useBeneficiaryGroups, useBeneficiaryGroupMutations } from "@/hooks/useBeneficiaryGroups";
import { UpdateBeneficiaryGroupRequest } from "@/types/beneficiaryGroup";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { LocaleContext } from "@/contexts/LocaleProvider";

export default function EditBeneficiaryGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const {locale} = useContext(LocaleContext);

  const { data: beneficiaries, isLoading: isLoadingBeneficiaries } = useBeneficiaries();
  const { data: groups, isLoading: isLoadingGroups } = useBeneficiaryGroups();
  const { updateBeneficiaryGroup } = useBeneficiaryGroupMutations();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const group = groups?.find((g) => g.groupId === groupId);

  useEffect(() => {
    if (!isLoadingGroups && !group) {
      setError("Groupe non trouvé");
    }
  }, [isLoadingGroups, group]);

  const handleSubmit = async (data: UpdateBeneficiaryGroupRequest) => {
    setError(null);

    const result = await updateBeneficiaryGroup.mutateAsync({groupId,updates: data});

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
      {(isLoadingBeneficiaries || isLoadingGroups) && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {!isLoadingBeneficiaries && !isLoadingGroups && !group && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 text-lg">
              Groupe non trouvé
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

      {!isLoadingBeneficiaries && !isLoadingGroups && group && (
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
              Modifier le groupe
            </h1>
            <p className="text-gray-600 mt-2">
              Modifiez les informations du groupe &quot;{group.groupName}&quot;
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
                Groupe modifié avec succès! Redirection...
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <GroupForm
              initialData={{
                groupName: group.groupName,
                beneficiaryIds: group.beneficiaryIds,
              }}
              beneficiaries={beneficiaries || []}
              onSubmit={handleSubmit}
              isLoading={updateBeneficiaryGroup.isPending}
            />
          </div>
        </div>
      )}
    </>
  );
}
