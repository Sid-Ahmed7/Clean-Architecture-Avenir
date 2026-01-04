"use client"
import { Input } from "@/components/ui/Input";
import { Beneficiary } from "@/types/beneficiary";
import { CreateBeneficiaryGroupRequest } from "@/types/beneficiaryGroup";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";

interface GroupFormFieldsProps {
  register: UseFormRegister<CreateBeneficiaryGroupRequest>;
  errors: FieldErrors<CreateBeneficiaryGroupRequest>;
  beneficiaries: Beneficiary[];
  selectedBeneficiaries: string[];
  onBeneficiaryToggle: (beneficiaryId: string) => void;
}

export function GroupFormFields({register,errors,beneficiaries,selectedBeneficiaries,onBeneficiaryToggle}: GroupFormFieldsProps) {
  const t = useTranslations('components.beneficiaries.group.form.fields');
    return (
    <div className="space-y-6">
      <Input
        label={t('groupName')}
        {...register("groupName")}
        error={errors.groupName?.message}
        placeholder="Groupe famille"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('selectBeneficiaries')}
        </label>

        {beneficiaries.length === 0 ? (
          <p className="text-gray-500 text-sm">{t('noBeneficiaries')}</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {beneficiaries.map((beneficiary) => (
              <label
                key={beneficiary.beneficiaryId}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selectedBeneficiaries.includes(beneficiary.beneficiaryId)}
                  onChange={() => onBeneficiaryToggle(beneficiary.beneficiaryId)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{beneficiary.beneficiaryName}</p>
                  <p className="text-sm text-gray-500">{beneficiary.iban}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {selectedBeneficiaries.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {t('selectedCount', { count: selectedBeneficiaries.length })}
          </p>
        )}
      </div>
    </div>
  );
}