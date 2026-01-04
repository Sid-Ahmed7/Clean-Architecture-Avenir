"use client";

import { useState } from "react";
import { BeneficiaryGroup } from "@/types/beneficiaryGroup";
import { Eye, Users, Calendar, FolderOpen } from "lucide-react";
import { BeneficiaryGroupDetailsSidebar } from "./BeneficiaryGroupDetailsSidebar";
import { useTranslations, useFormatter } from "next-intl";

interface BeneficiaryGroupsTableProps {
  groups: BeneficiaryGroup[];
  onEdit: (group: BeneficiaryGroup) => void;
  onDelete: (groupId: string) => void;
  onAddBeneficiary?: (groupId: string) => void;
  onRemoveBeneficiary?: (groupId: string) => void;
  onViewBeneficiaries?: (group: BeneficiaryGroup) => void;
  onTransferToGroup?: (group: BeneficiaryGroup) => void;
  isLoading?: boolean;
}

export function BeneficiaryGroupsTable({ groups, onEdit, onDelete, onAddBeneficiary, onRemoveBeneficiary, onViewBeneficiaries, onTransferToGroup, isLoading = false }: BeneficiaryGroupsTableProps) {
  const t = useTranslations('components.beneficiaries.group.table');
  const format = useFormatter();
  const [selectedGroup, setSelectedGroup] = useState<BeneficiaryGroup | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleRowClick = (group: BeneficiaryGroup) => {
    setSelectedGroup(group);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setSelectedGroup(null), 300);
  };

  return (
    <>
      {isLoading ? (
        <div className="w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      ) : !groups || groups.length === 0 ? (
        <div className="w-full bg-white rounded-lg shadow-md p-8 text-center">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">{t('noGroups')}</p>
          <p className="text-sm text-gray-500 mt-2">
            {t('noGroupsDesc')}
          </p>
        </div>
      ) : (
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">{t('columns.groupName')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">{t('columns.membersCount')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">{t('columns.createdAt')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">{t('columns.updatedAt')}</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">{t('columns.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {groups.map((group) => (
                  <tr
                    key={group.groupId}
                    className="hover:bg-purple-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(group)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {group.groupName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {t('members', { count: group.beneficiaryIds.length })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{format.dateTime(new Date(group.createdAt), {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{format.dateTime(new Date(group.updatedAt), {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(group);
                          }}
                          className="p-2 hover:bg-purple-100 rounded-lg transition-colors group"
                          aria-label={t('viewDetails')}
                        >
                          <Eye className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <BeneficiaryGroupDetailsSidebar
        group={selectedGroup}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddBeneficiary={onAddBeneficiary}
        onRemoveBeneficiary={onRemoveBeneficiary}
        onViewBeneficiaries={onViewBeneficiaries}
        onTransferToGroup={onTransferToGroup}
      />
    </>
  );
}
