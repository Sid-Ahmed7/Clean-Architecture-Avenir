"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { BeneficiariesManager } from "@/components/beneficiaries/BeneficiariesManager";
import { BeneficiaryDetailsSidebar } from "@/components/beneficiaries/BeneficiaryDetailsSidebar";
import { GroupMembersTable } from "@/components/beneficiaries/group/GroupMembersTable";
import { useBeneficiaries, useBeneficiaryMutations } from "@/hooks/useBeneficiaries";
import { useBeneficiaryGroups, useBeneficiaryGroupMutations } from "@/hooks/useBeneficiaryGroups";
import { Beneficiary } from "@/types/beneficiary";
import { BeneficiaryGroup } from "@/types/beneficiaryGroup";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { LocaleContext } from "@/contexts/LocaleProvider";

export default function BeneficiariesPage() {
  const router = useRouter();
  const { locale } = useContext(LocaleContext);

  const { data: beneficiaries, isLoading: isLoadingBeneficiaries } = useBeneficiaries();
  const { data: groups, isLoading: isLoadingGroups } = useBeneficiaryGroups();

  const { deleteBeneficiary } = useBeneficiaryMutations();
  const { deleteBeneficiaryGroup, removeBeneficiaryFromGroup } = useBeneficiaryGroupMutations();

  const [selectedGroup, setSelectedGroup] = useState<BeneficiaryGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleEditBeneficiary = (beneficiary: Beneficiary) => {
    router.push(`/${locale}/client/beneficiaries/edit/${beneficiary.beneficiaryId}`);
  };

  const handleDeleteBeneficiary = (beneficiaryId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce bénéficiaire ?")) {
      deleteBeneficiary.mutate(beneficiaryId);
    }
  };

  const handleTransfer = (beneficiary: Beneficiary) => {
    router.push(`/${locale}/client/beneficiaries/transfer/${beneficiary.beneficiaryId}`);
  };

  const handleEditGroup = (group: BeneficiaryGroup) => {
    router.push(`/${locale}/client/beneficiaries/groups/edit/${group.groupId}`);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      deleteBeneficiaryGroup.mutate(groupId);
    }
  };


  const handleViewGroupBeneficiaries = (group: BeneficiaryGroup) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleRemoveBeneficiaryFromGroupModal = (beneficiaryId: string) => {
    if (selectedGroup && confirm("Êtes-vous sûr de vouloir retirer ce bénéficiaire du groupe ?")) {
      removeBeneficiaryFromGroup.mutate({
        groupId: selectedGroup.groupId,
        beneficiaryId,
      });
    }
  };

  const groupMembers = selectedGroup
    ? (beneficiaries || []).filter((b) =>
        selectedGroup.beneficiaryIds.includes(b.beneficiaryId)
      )
    : [];

  const handleViewBeneficiaryDetails = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsSidebarOpen(true);
  };

  const handleCreateBeneficiary = () => {
    router.push(`/${locale}/client/beneficiaries/add`);
  };

  const handleCreateGroup = () => {
    router.push(`/${locale}/client/beneficiaries/groups/add`);
  };

  const handleTransferToGroup = (group: BeneficiaryGroup) => {
    router.push(`/${locale}/client/beneficiaries/groups/transfer/${group.groupId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Bénéficiaires
          </h1>
          <p className="text-gray-600">
            Gérez vos bénéficiaires et organisez-les en groupes
          </p>
        </div>

        <div className="mb-6 flex gap-4">
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleCreateBeneficiary}
          >
            Nouveau bénéficiaire
          </Button>
          <Button
            variant="gradient"
            icon={Plus}
            onClick={handleCreateGroup}
          >
            Nouveau groupe
          </Button>
        </div>

        <BeneficiariesManager
          beneficiaries={beneficiaries || []}
          groups={groups || []}
          isLoadingBeneficiaries={isLoadingBeneficiaries}
          isLoadingGroups={isLoadingGroups}
          onEditBeneficiary={handleEditBeneficiary}
          onDeleteBeneficiary={handleDeleteBeneficiary}
          onTransferBeneficiary={handleTransfer}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
          onViewGroupBeneficiaries={handleViewGroupBeneficiaries}
          onTransferToGroup={handleTransferToGroup}
        />

        <GroupMembersTable
          group={selectedGroup}
          members={groupMembers}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTransfer={handleTransfer}
          onRemoveMember={handleRemoveBeneficiaryFromGroupModal}
          onViewDetails={handleViewBeneficiaryDetails}
        />

        <BeneficiaryDetailsSidebar
          beneficiary={selectedBeneficiary}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onEdit={handleEditBeneficiary}
          onDelete={handleDeleteBeneficiary}
          onTransfer={handleTransfer}
        />
      </div>
    </div>
  );
}
