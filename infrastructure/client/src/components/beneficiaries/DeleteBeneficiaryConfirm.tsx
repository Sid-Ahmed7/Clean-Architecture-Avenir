import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

interface DeleteBeneficiaryConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  beneficiaryName: string;
  isLoading?: boolean;
}

export function DeleteBeneficiaryConfirm({ isOpen, onClose, onConfirm, beneficiaryName, isLoading }: DeleteBeneficiaryConfirmProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Supprimer le bénéficiaire</h2>
          </div>

          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer <strong>{beneficiaryName}</strong> ? Cette action est irréversible.
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              fullWidth
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              loading={isLoading}
              fullWidth
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}