"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { TransferToGroupForm } from "@/components/beneficiaries/group/form/TransferToGroupForm";
import { useBeneficiaryGroups, useBeneficiaryGroupMutations } from "@/hooks/useBeneficiaryGroups";
import { useBeneficiaries } from "@/hooks/useBeneficiaries";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { TransferDataGroup } from "@/types/beneficiaryGroup";



export default function TransferToGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const { locale } = useContext(LocaleContext);
  const { data: groups, isLoading: isLoadingGroups } = useBeneficiaryGroups();
  const { data: beneficiaries, isLoading: isLoadingBeneficiaries } = useBeneficiaries();
  const { transferToGroup } = useBeneficiaryGroupMutations();
  const [error, setError] = useState<string | null>(null);

  const group = groups?.find((g) => g.groupId === groupId);
  const groupBeneficiaries = beneficiaries?.filter((b) =>
    group?.beneficiaryIds.includes(b.beneficiaryId)
  );

  useEffect(() => {
    if (!isLoadingGroups && !group) {
      setError("Groupe non trouvé");
    }
  }, [isLoadingGroups, group]);

  useEffect(() => {
    if (transferToGroup.isSuccess && transferToGroup.data?.data) {
      router.push(`/${locale}/client/beneficiaries`);
    }
  }, [transferToGroup.isSuccess, transferToGroup.data, router, locale]);

  useEffect(() => {
    if (transferToGroup.data?.error) {
      setError(transferToGroup.data.error);
    }
  }, [transferToGroup.data?.error]);

  const handleSubmit = async (data: TransferDataGroup) => {
    setError(null);

    const transferData = {
      groupId: groupId,
      sourceAccountNumber: data.sourceAccountNumber,
      amountPerBeneficiary: data.totalAmount / (groupBeneficiaries?.length || 1)
    };

    transferToGroup.mutate({groupId: groupId,transferData: transferData});
  };

  const handleCancel = () => {
    router.push(`/${locale}/client/beneficiaries`);
  };

  const isLoading = isLoadingGroups || isLoadingBeneficiaries;

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {!isLoading && !group && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 text-lg">Groupe non trouvé</p>
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

      {!isLoading && group && groupBeneficiaries && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href={`/${locale}/client/beneficiaries`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux bénéficiaires
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Transfert au groupe
            </h1>
            <p className="text-gray-600 mt-2">
              Répartissez le montant entre les membres du groupe &quot;{group.groupName}&quot;
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <TransferToGroupForm
              group={group}
              beneficiaries={groupBeneficiaries}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </>
  );
}
