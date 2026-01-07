"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, Clock3, Loader2, PencilLine, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { GroupForm } from "@/components/beneficiaries/group/form/GroupForm";
import { useBeneficiaries } from "@/hooks/useBeneficiaries";
import { useBeneficiaryGroupMutations } from "@/hooks/useBeneficiaryGroups";
import { CreateBeneficiaryGroupRequest } from "@/types/beneficiaryGroup";
import { LocaleContext } from "@/contexts/LocaleProvider";

export default function AddBeneficiaryGroupPage() {
  const router = useRouter();
  const { locale } = useContext(LocaleContext);
  const t = useTranslations("client.beneficiaries.groupAddPage");

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {isLoadingBeneficiaries ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}/client/beneficiaries`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-blue-700"
                icon={ArrowLeft}
              >
                {t("back")}
              </Button>
            </Link>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-white/80 border border-gray-200 rounded-full shadow-sm">
                {t("title")}
              </span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 sm:px-8 py-6 border-b border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                {t("title")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {t("subtitle")}
              </h1>
              <p className="text-gray-600 mt-2">{t("helper")}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                  <Clock3 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">{t("tips.fast")}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-gray-700">{t("tips.secure")}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
                  <PencilLine className="w-5 h-5 text-violet-600" />
                  <span className="text-sm text-gray-700">{t("tips.editable")}</span>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-8 space-y-4">
              {error && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800">
                  {t("success")}
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <GroupForm
                  beneficiaries={beneficiaries || []}
                  onSubmit={handleSubmit}
                  isLoading={createBeneficiaryGroup.isPending}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
