"use client";

import { Beneficiary } from "@/types/beneficiary";
import { X } from "lucide-react";
import { BeneficiaryCard } from "./BeneficiaryCard";
import { useTranslations } from "next-intl";

interface BeneficiaryDetailsSidebarProps {
  beneficiary: Beneficiary | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (beneficiaryId: string) => void;
  onTransfer: (beneficiary: Beneficiary) => void;
}

export function BeneficiaryDetailsSidebar({beneficiary,isOpen,onClose,onEdit,onDelete,onTransfer,}: BeneficiaryDetailsSidebarProps) {
  const t = useTranslations("components.beneficiariesManager.sidebar");
  if (!beneficiary) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-screen bg-white border-l border-gray-200 w-96 z-50 transform transition-transform duration-300 shadow-xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{t("title")}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={t("close")}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <BeneficiaryCard
              beneficiary={beneficiary}
              onEdit={onEdit}
              onDelete={(id) => {
                onDelete(id);
                onClose();
              }}
              onTransfer={onTransfer}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
