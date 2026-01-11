import { Beneficiary } from "@/types/beneficiary";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import { Edit, Send, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface BeneficiaryCardProps {
    beneficiary: Beneficiary;
    onEdit: (beneficiary: Beneficiary) => void;
    onDelete: (beneficiaryId: string) => void;
    onTransfer: (beneficiary: Beneficiary) => void;
}


export function BeneficiaryCard({beneficiary, onEdit, onDelete, onTransfer} : BeneficiaryCardProps){
  const t = useTranslations("components.beneficiariesManager.card");

  return (    
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{beneficiary.beneficiaryName}</h3>
          <p className="text-sm text-gray-600">{beneficiary.iban}</p>
          {beneficiary.email && (
            <p className="text-sm text-gray-500">{beneficiary.email}</p>
          )}
        </div>
        {beneficiary.isVerified && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            {t("verified")}
          </span>
        )}
      </div>

      {beneficiary.address && (
        <div className="mb-4 text-sm text-gray-600">
          <p>{beneficiary.address.street}</p>
          <p>{beneficiary.address.postalCode} {beneficiary.address.city}</p>
        </div>
      )}
      <p className="text-sm text-gray-600 mb-4">{beneficiary.country}</p>

      <div className="flex gap-2 mt-4">
        <Button
          variant="primary"
          size="sm"
          icon={Send}
          onClick={() => onTransfer(beneficiary)}
        >
          {t("transferButton")}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={Edit}
          onClick={() => onEdit(beneficiary)}
        >
          {t("editButton")}
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={() => onDelete(beneficiary.beneficiaryId)}
        >
          {t("deleteButton")}
        </Button>
      </div>
    </Card>
  );

}