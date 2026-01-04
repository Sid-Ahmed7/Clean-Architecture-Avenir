"use client";

import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BeneficiaryGroup } from "@/types/beneficiaryGroup";
import { useTranslations } from "next-intl";

import { Edit, Trash2, Users, UserPlus, Send} from "lucide-react";

interface BeneficiaryGroupCardProps {
  group: BeneficiaryGroup;
  beneficiariesCount?: number;
  onEdit: (group: BeneficiaryGroup) => void;
  onDelete: (groupId: string) => void;
  onAddBeneficiary?: (groupId: string) => void;
  onRemoveBeneficiary?: (groupId: string) => void;
  onViewBeneficiaries?: (group: BeneficiaryGroup) => void;
  onTransferToGroup?: (group: BeneficiaryGroup) => void;
}

export function BeneficiaryGroupCard({group,beneficiariesCount,onEdit,onDelete,onAddBeneficiary,onViewBeneficiaries,onTransferToGroup}: BeneficiaryGroupCardProps) {
  const t = useTranslations('components.beneficiaries.group.card');
  const count = beneficiariesCount ?? group.beneficiaryIds.length;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{group.groupName}</h3>
              <p className="text-sm text-gray-600">
                {t('beneficiariesCount', { count })}
              </p>
            </div>
          </div>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
          {t('badge')}
        </span>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <p>
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

      <div className="flex flex-wrap gap-2 mt-4">
        {onViewBeneficiaries && (
          <Button
            variant="primary"
            size="sm"
            icon={Users}
            onClick={() => onViewBeneficiaries(group)}
          >
            {t('viewMembers')}
          </Button>
        )}
        {onTransferToGroup && count > 0 && (
          <Button
            variant="success"
            size="sm"
            icon={Send}
            onClick={() => onTransferToGroup(group)}
          >
            {t('transfer')}
          </Button>
        )}
        {onAddBeneficiary && (
          <Button
            variant="success"
            size="sm"
            icon={UserPlus}
            onClick={() => onAddBeneficiary(group.groupId)}
          >
            {t('add')}
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          icon={Edit}
          onClick={() => onEdit(group)}
        >
          {t('edit')}
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={() => onDelete(group.groupId)}
        >
          {t('delete')}
        </Button>
      </div>
    </Card>
  );
}
