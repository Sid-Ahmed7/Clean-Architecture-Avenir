"use client";

import Button from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { TableColumn } from "@/components/ui/TableHeader";
import { Beneficiary } from "@/types/beneficiary";
import { BeneficiaryGroup } from "@/types/beneficiaryGroup";
import { X, Users, Send, UserMinus, Eye, Mail, MapPin} from "lucide-react";
import { useTranslations } from "next-intl";

interface GroupMembersTableProps {
  group: BeneficiaryGroup | null;
  members: Beneficiary[];
  isOpen: boolean;
  onClose: () => void;
  onTransfer?: (beneficiary: Beneficiary) => void;
  onRemoveMember?: (beneficiaryId: string) => void;
  onViewDetails?: (beneficiary: Beneficiary) => void;
}

export function GroupMembersTable({group,members,isOpen,onClose,onTransfer,onRemoveMember,onViewDetails}: GroupMembersTableProps) {
  const t = useTranslations('components.beneficiaries.group.membersTable');
  if (!isOpen || !group) return null;

  const columns: TableColumn[] = [
    { key: "beneficiary", label: t('columns.beneficiary'), align: "left" },
    { key: "iban", label: t('columns.iban'), align: "left" },
    { key: "contact", label: t('columns.contact'), align: "left" },
    { key: "status", label: t('columns.status'), align: "left" },
    { key: "actions", label: t('columns.actions'), align: "right" },
  ];

  const renderRow = (member: Beneficiary) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {member.beneficiaryName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">
              {member.beneficiaryName}
            </div>
            {member.address && (
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {member.address.city}, {member.address.country}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-mono text-gray-900 bg-gray-100 rounded px-3 py-1 inline-block">
          {member.iban}
        </div>
      </td>
      <td className="px-6 py-4">
        {member.email ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate max-w-[200px]" title={member.email}>
              {member.email}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">{t('noContact')}</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {member.isVerified ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            {t('verified')}
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            {t('pending')}
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end gap-2">
          {onViewDetails && (
            <Button
              variant="secondary"
              size="sm"
              icon={Eye}
              onClick={() => onViewDetails(member)}
            >
              {t('details')}
            </Button>
          )}
          {onTransfer && (
            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={() => onTransfer(member)}
            >
              {t('transfer')}
            </Button>
          )}
          {onRemoveMember && (
            <Button
              variant="danger"
              size="sm"
              icon={UserMinus}
              onClick={() => onRemoveMember(member.beneficiaryId)}
            >
              {t('remove')}
            </Button>
          )}
        </div>
      </td>
    </>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {group.groupName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {t('membersCount', { count: members.length })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('noMembers')}
                </h3>
                <p className="text-gray-600 max-w-md">
                  {t('noMembersDesc')}
                </p>
              </div>
            ) : (
              <Table
                data={members}
                columns={columns}
                renderRow={renderRow}
                keyExtractor={(member) => member.beneficiaryId}
                emptyMessage={t('noMembersInGroup')}
                initialItemsPerPage={10}
                itemLabel={t('itemLabel')}
                showControls={true}
              />
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p className="font-medium">
                  {t('createdAt', {
                    date: new Date(group.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  })}
                </p>
                {group.updatedAt !== group.createdAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t('updatedAt', {
                      date: new Date(group.updatedAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    })}
                  </p>
                )}
              </div>
              <Button variant="secondary" onClick={onClose}>
                {t('close')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
