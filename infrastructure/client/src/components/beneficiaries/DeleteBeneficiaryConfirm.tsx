import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";
import { useTranslations } from "next-intl";

interface DeleteBeneficiaryConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  beneficiaryName: string;
  isLoading?: boolean;
}

export function DeleteBeneficiaryConfirm({ isOpen, onClose, onConfirm, beneficiaryName, isLoading }: DeleteBeneficiaryConfirmProps) {
  const t = useTranslations("components.beneficiariesManager.deleteConfirm");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t("title")}</h2>
          </div>

          <p className="text-gray-600 mb-6">
            {t("message")} <strong>{beneficiaryName}</strong>{t("warning")}
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              fullWidth
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              loading={isLoading}
              fullWidth
            >
              {t("confirm")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}