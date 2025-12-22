"use client";

import { useState } from "react";
import { Beneficiary } from "@/types/beneficiary";
import Button from "@/components/ui/Button";
import { Users, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface TransferToAllBeneficiariesFormProps {
  beneficiaries: Beneficiary[];
  onSubmit: (data: {
    sourceAccountNumber: number;
    totalAmount: number;
    amountPerBeneficiary: number;
  }) => void;
  onCancel: () => void;
}

export function TransferToAllBeneficiariesForm({beneficiaries,onSubmit,onCancel}: TransferToAllBeneficiariesFormProps) {
  const [sourceAccountNumber, setSourceAccountNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const beneficiaryCount = beneficiaries.length;
  const amountPerBeneficiary = totalAmount && beneficiaryCount > 0
    ? parseFloat(totalAmount) / beneficiaryCount
    : 0;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!sourceAccountNumber) {
      newErrors.sourceAccountNumber = "Le numéro de compte source est requis";
    }

    if (!totalAmount) {
      newErrors.totalAmount = "Le montant total est requis";
    } else if (parseFloat(totalAmount) <= 0) {
      newErrors.totalAmount = "Le montant doit être supérieur à 0";
    }

    if (beneficiaryCount === 0) {
      newErrors.general = "Vous devez avoir au moins un bénéficiaire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      sourceAccountNumber: parseInt(sourceAccountNumber),
      totalAmount: parseFloat(totalAmount),
      amountPerBeneficiary,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900">
              Transfert à tous vos bénéficiaires
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Le montant total sera réparti équitablement entre {beneficiaryCount} bénéficiaire(s)
            </p>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p>{errors.general}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Input
            label="Numéro de compte source"
            type="number"
            value={sourceAccountNumber}
            onChange={(e) => {
              setSourceAccountNumber(e.target.value);
              if (errors.sourceAccountNumber) {
                setErrors({ ...errors, sourceAccountNumber: "" });
              }
            }}
            placeholder="Ex: 123456789"
            required
          />
          {errors.sourceAccountNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.sourceAccountNumber}</p>
          )}
        </div>

        <div>
          <Input
            label="Montant total à transférer (€)"
            type="number"
            step="0.01"
            min="0.01"
            value={totalAmount}
            onChange={(e) => {
              setTotalAmount(e.target.value);
              if (errors.totalAmount) {
                setErrors({ ...errors, totalAmount: "" });
              }
            }}
            placeholder="Ex: 100.00"
            required
          />
          {errors.totalAmount && (
            <p className="text-red-600 text-sm mt-1">{errors.totalAmount}</p>
          )}
        </div>
      </div>

      {totalAmount && parseFloat(totalAmount) > 0 && beneficiaryCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-900">
                Répartition du montant
              </p>
              <div className="mt-2 space-y-1 text-sm text-green-800">
                <p>
                  <span className="font-medium">Montant total:</span>{" "}
                  {parseFloat(totalAmount).toFixed(2)} €
                </p>
                <p>
                  <span className="font-medium">Nombre de bénéficiaires:</span>{" "}
                  {beneficiaryCount}
                </p>
                <p className="text-base font-semibold mt-2">
                  Chaque bénéficiaire recevra: {amountPerBeneficiary.toFixed(2)} €
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {beneficiaries.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Bénéficiaires concernés ({beneficiaries.length})
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {beneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.beneficiaryId}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {beneficiary.beneficiaryName}
                  </p>
                  <p className="text-xs text-gray-500">
                    IBAN: {beneficiary.iban}
                  </p>
                </div>
                {amountPerBeneficiary > 0 && (
                  <span className="text-sm font-semibold text-green-600">
                    +{amountPerBeneficiary.toFixed(2)} €
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={beneficiaryCount === 0}
          className="flex-1"
        >
          Confirmer le transfert
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
