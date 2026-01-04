
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BeneficiaryGroup } from "@/types/beneficiaryGroup";
import { Beneficiary } from "@/types/beneficiary";
import { Send, User, } from "lucide-react";
import { useUserAccounts } from "@/hooks/useUserAccounts";
import { useTranslations, useFormatter } from "next-intl";

interface TransferToGroupFormProps {
  group: BeneficiaryGroup;
  beneficiaries: Beneficiary[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function TransferToGroupForm({ group, beneficiaries, onSubmit, onCancel }: TransferToGroupFormProps) {
  const t = useTranslations('components.beneficiaries.group.form.transferToGroup');
  const format = useFormatter();
  const { accounts, loading: loadingAccounts } = useUserAccounts();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [individualAmounts, setIndividualAmounts] = useState<Record<string, number>>({});
  const [sourceAccountNumber, setSourceAccountNumber] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const distributedAmount = Object.values(individualAmounts).reduce((sum, amount) => sum + (amount || 0), 0);
  const remainingAmount = totalAmount - distributedAmount;

  const handleIndividualAmountChange = (beneficiaryId: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setIndividualAmounts(prev => ({
      ...prev,
      [beneficiaryId]: amount
    }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ sourceAccountNumber, totalAmount, individualAmounts });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-2">{t('group')}: {group.groupName}</h3>
        <p className="text-sm text-gray-600">
          {t('beneficiariesCount', { count: beneficiaries.length })}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('sourceAccount')}
        </label>
        {loadingAccounts ? (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-300">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">{t('loadingAccounts')}</span>
          </div>
        ) : (
          <select
            value={sourceAccountNumber || ''}
            onChange={(e) => setSourceAccountNumber(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            required
          >
            <option value="">{t('selectAccount')}</option>
            {accounts.map((account) => (
              <option key={account.accountNumber} value={account.accountNumber}>
                {account.accountType} - {account.accountNumber} ({format.number(account.currentBalance, { style: 'currency', currency: account.currency })})
              </option>
            ))}
          </select>
        )}
      </div>

      <Input
        label={t('totalAmount')}
        type="number"
        step="0.01"
        value={totalAmount || ''}
        onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
        placeholder="1000.00"
        required
      />

      <div className="border-t pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          {t('distributionTitle')}
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {beneficiaries.map((beneficiary) => (
            <div key={beneficiary.beneficiaryId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {beneficiary.beneficiaryName}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {beneficiary.iban}
                </p>
              </div>
              <div className="w-40 flex-shrink-0">
                <Input
                  type="number"
                  step="0.01"
                  value={individualAmounts[beneficiary.beneficiaryId] || ''}
                  onChange={(e) => handleIndividualAmountChange(beneficiary.beneficiaryId, e.target.value)}
                  placeholder="0.00"
                  className="text-right"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-lg border-2 ${remainingAmount === 0
          ? 'bg-green-50 border-green-300'
          : remainingAmount > 0
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-red-50 border-red-300'
        }`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-900">{t('totalAmountLabel')}:</span>
          <span className="text-lg font-bold">{format.number(totalAmount, { style: 'currency', currency: 'EUR' })}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-900">{t('distributedAmount')}:</span>
          <span className="text-lg font-bold">{format.number(distributedAmount, { style: 'currency', currency: 'EUR' })}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-300">
          <span className="font-semibold text-gray-900">{t('difference')}:</span>
          <span className={`text-xl font-bold ${remainingAmount === 0
              ? 'text-green-600'
              : remainingAmount > 0
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
            {format.number(remainingAmount, { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
        {remainingAmount !== 0 && (
          <p className="mt-2 text-sm text-gray-600">
            {remainingAmount > 0
              ? t('remainingAmount', { amount: format.number(remainingAmount, { style: 'currency', currency: 'EUR' }) })
              : t('exceededAmount', { amount: format.number(Math.abs(remainingAmount), { style: 'currency', currency: 'EUR' }) })
            }
          </p>
        )}
      </div>

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
          loading={isSubmitting}
          disabled={remainingAmount !== 0 || totalAmount === 0}
          fullWidth
        >
          {t('submit')}
        </Button>
      </div>
    </form>
  );
}