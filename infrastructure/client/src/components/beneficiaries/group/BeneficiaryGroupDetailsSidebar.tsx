"use client";

import { BeneficiaryGroup } from "@/types/beneficiaryGroup";
import { X } from "lucide-react";
import { BeneficiaryGroupCard } from "./BeneficiaryGroupCard";

interface BeneficiaryGroupDetailsSidebarProps {
  group: BeneficiaryGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (group: BeneficiaryGroup) => void;
  onDelete: (groupId: string) => void;
  onAddBeneficiary?: (groupId: string) => void;
  onRemoveBeneficiary?: (groupId: string) => void;
  onViewBeneficiaries?: (group: BeneficiaryGroup) => void;
  onTransferToGroup?: (group: BeneficiaryGroup) => void;
}

export function BeneficiaryGroupDetailsSidebar({group,isOpen,onClose,onEdit,onDelete,onAddBeneficiary,onRemoveBeneficiary,onViewBeneficiaries,onTransferToGroup}: BeneficiaryGroupDetailsSidebarProps) {
  if (!group) return null;

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
            <h2 className="text-xl font-bold text-gray-900">Détails du groupe</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <BeneficiaryGroupCard
              group={group}
              onEdit={onEdit}
              onDelete={(id) => {
                onDelete(id);
                onClose();
              }}
              onAddBeneficiary={onAddBeneficiary}
              onRemoveBeneficiary={onRemoveBeneficiary}
              onViewBeneficiaries={onViewBeneficiaries}
              onTransferToGroup={onTransferToGroup}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
