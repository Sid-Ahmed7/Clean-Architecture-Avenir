"use client";

import { useState } from "react";
import { Beneficiary } from "@/types/beneficiary";
import { Eye, Mail, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";
import { BeneficiaryDetailsSidebar } from "./BeneficiaryDetailsSidebar";
import { Table } from "../ui/Table";
import { TableColumn } from "../ui/TableHeader";
import { formatDate } from "@/lib/utils/date";

interface BeneficiariesTableProps {
  beneficiaries: Beneficiary[];
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (beneficiaryId: string) => void;
  onTransfer: (beneficiary: Beneficiary) => void;
  isLoading?: boolean;
}

export function BeneficiariesTable({beneficiaries,onEdit,onDelete,onTransfer,isLoading = false}: BeneficiariesTableProps) {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleRowClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setSelectedBeneficiary(null), 300);
  };


  const columns: TableColumn[] = [
    { key: "name", label: "Nom", align: "left" },
    { key: "iban", label: "IBAN", align: "left" },
    { key: "email", label: "Email", align: "left" },
    { key: "country", label: "Pays", align: "left" },
    { key: "status", label: "Statut", align: "left" },
    { key: "created", label: "Date de création", align: "left" },
    { key: "action", label: "Action", align: "center" },
  ];

  const renderRow = (beneficiary: Beneficiary) => (
    <>
      <td className="px-6 py-4 cursor-pointer" onClick={() => handleRowClick(beneficiary)}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
            {beneficiary.beneficiaryName.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900">
            {beneficiary.beneficiaryName}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 cursor-pointer" onClick={() => handleRowClick(beneficiary)}>
        <span className="font-mono text-sm text-gray-700">
          {beneficiary.iban}
        </span>
      </td>
      <td className="px-6 py-4 cursor-pointer" onClick={() => handleRowClick(beneficiary)}>
        {beneficiary.email ? (
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{beneficiary.email}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 cursor-pointer" onClick={() => handleRowClick(beneficiary)}>
        {beneficiary.country ? (
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{beneficiary.country}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 cursor-pointer" onClick={() => handleRowClick(beneficiary)}>
        {beneficiary.isVerified ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Vérifié
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Non vérifié
          </span>
        )}
      </td>
      <td className="px-6 py-4 cursor-pointer" onClick={() => handleRowClick(beneficiary)}>
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{formatDate(beneficiary.createdAt)}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(beneficiary);
            }}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
            aria-label="Voir les détails"
          >
            <Eye className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
          </button>
        </div>
      </td>
    </>
  );

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement des bénéficiaires...</p>
      </div>
    );
  }

  return (
    <>
      <Table
        data={beneficiaries}
        columns={columns}
        renderRow={renderRow}
        keyExtractor={(beneficiary) => beneficiary.beneficiaryId}
        emptyMessage="Aucun bénéficiaire trouvé"
        initialItemsPerPage={10}
        itemLabel="bénéficiaires"
        showControls={true}
      />

      <BeneficiaryDetailsSidebar
        beneficiary={selectedBeneficiary}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onEdit={onEdit}
        onDelete={onDelete}
        onTransfer={onTransfer}
      />
    </>
  );
}
