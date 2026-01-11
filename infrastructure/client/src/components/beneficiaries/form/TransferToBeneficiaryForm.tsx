"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Beneficiary } from "@/types/beneficiary";
import { Send } from "lucide-react";
import { TransferToBeneficiaryRequest } from "@/types/transfer";
import { transferToBeneficiarySchema } from "@/lib/validation/transfer/transferToBeneficiarySchema";
import { useTranslations, useFormatter } from "next-intl";
import { useUserAccounts } from "@/hooks/useUserAccounts";

interface TransferToBeneficiaryFormProps {
  beneficiary: Beneficiary;
  onSubmit: (data: TransferToBeneficiaryRequest) => Promise<void>;
  onCancel: () => void;
}

export function TransferToBeneficiaryForm({ beneficiary, onSubmit, onCancel }: TransferToBeneficiaryFormProps) {
  const t = useTranslations('components.beneficiaries.form.transferToBeneficiary');
  const format = useFormatter();
  const { accounts, loading: loadingAccounts } = useUserAccounts();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TransferToBeneficiaryRequest>({
    resolver: zodResolver(transferToBeneficiarySchema(t)),
    defaultValues: {
      beneficiaryId: beneficiary.beneficiaryId,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">{t('beneficiary')}</h3>
        <p className="text-gray-700">{beneficiary.beneficiaryName}</p>
        <p className="text-sm text-gray-600">{beneficiary.iban}</p>
      </div>

      <div>
        <label htmlFor="sourceAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
          {t('sourceAccount')}
        </label>
        <select
          id="sourceAccountNumber"
          {...register("sourceAccountNumber", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loadingAccounts}
        >
          <option value="">{t('selectAccount')}</option>
          {accounts.map((account) => (
            <option key={account.accountNumber} value={account.accountNumber}>
              {account.accountType} - {account.accountNumber} ({format.number(account.currentBalance, { style: 'currency', currency: account.currency })})
            </option>
          ))}
        </select>
        {errors.sourceAccountNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.sourceAccountNumber.message}</p>
        )}
      </div>

      <Input
        label={t('amount')}
        type="number"
        step="0.01"
        {...register("amount", { valueAsNumber: true })}
        error={errors.amount?.message}
        placeholder="100.00"
      />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          fullWidth
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={Send}
          loading={isSubmitting || loadingAccounts}
          fullWidth
        >
          {t('submitTransfer')}
        </Button>
      </div>
    </form>
  );
}