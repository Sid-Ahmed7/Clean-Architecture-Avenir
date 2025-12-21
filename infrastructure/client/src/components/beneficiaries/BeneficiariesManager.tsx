"use client";

import { useState } from "react";
import { Beneficiary } from "@/types/beneficiary";
import { BeneficiaryGroup } from "@/types/beneficiaryGroup";
import { BeneficiariesTable } from "./BeneficiariesTable";
import { BeneficiaryGroupsTable } from "./group/BeneficiaryGroupsTable";
import { Users, FolderOpen } from "lucide-react";

interface BeneficiariesManagerProps {
  beneficiaries: Beneficiary[];
  groups: BeneficiaryGroup[];
  isLoadingBeneficiaries?: boolean;
  isLoadingGroups?: boolean;
  onEditBeneficiary: (beneficiary: Beneficiary) => void;
  onDeleteBeneficiary: (beneficiaryId: string) => void;
  onTransferBeneficiary: (beneficiary: Beneficiary) => void;
  onEditGroup: (group: BeneficiaryGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddBeneficiaryToGroup?: (groupId: string) => void;
  onRemoveBeneficiaryFromGroup?: (groupId: string) => void;
  onViewGroupBeneficiaries?: (group: BeneficiaryGroup) => void;
  onTransferToGroup?: (group: BeneficiaryGroup) => void;
}

type Tab = "beneficiaries" | "groups";

export function BeneficiariesManager({beneficiaries,groups,isLoadingBeneficiaries = false,isLoadingGroups = false,onEditBeneficiary,onDeleteBeneficiary,onTransferBeneficiary,onEditGroup,onDeleteGroup,onAddBeneficiaryToGroup,onRemoveBeneficiaryFromGroup,onViewGroupBeneficiaries,onTransferToGroup}: BeneficiariesManagerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("beneficiaries");

  return (
    <div className="w-full">
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("beneficiaries")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
              activeTab === "beneficiaries"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Bénéficiaires</span>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {beneficiaries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("groups")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
              activeTab === "groups"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span>Groupes</span>
            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              {groups.length}
            </span>
          </button>
        </nav>
      </div>

      <div className="transition-all duration-300">
        {activeTab === "beneficiaries" ? (
          <BeneficiariesTable
            beneficiaries={beneficiaries}
            isLoading={isLoadingBeneficiaries}
            onEdit={onEditBeneficiary}
            onDelete={onDeleteBeneficiary}
            onTransfer={onTransferBeneficiary}
          />
        ) : (
          <BeneficiaryGroupsTable
            groups={groups}
            isLoading={isLoadingGroups}
            onEdit={onEditGroup}
            onDelete={onDeleteGroup}
            onAddBeneficiary={onAddBeneficiaryToGroup}
            onRemoveBeneficiary={onRemoveBeneficiaryFromGroup}
            onViewBeneficiaries={onViewGroupBeneficiaries}
            onTransferToGroup={onTransferToGroup}
          />
        )}
      </div>
    </div>
  );
}
