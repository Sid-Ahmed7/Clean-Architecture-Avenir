"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Pagination } from "./Pagination";
import { Select } from "./Select";
import { TableColumn, TableHeader } from "./TableHeader";

interface TableProps<T> {
  data: T[];
  columns: TableColumn[];
  renderRow: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  initialItemsPerPage?: number;
  pageSizeOptions?: number[];
  showControls?: boolean;
  className?: string;
  itemLabel?: string; 
}

export function Table<T>({
  data,
  columns,
  renderRow,
  keyExtractor,
  emptyMessage = "Aucune donnée disponible",
  initialItemsPerPage = 10,
  pageSizeOptions = [5, 10, 15, 20],
  showControls = true,
  className = "",
  itemLabel = "éléments",
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, data]);

  const pageSizeSelectOptions = pageSizeOptions.map((size) => ({
    label: size.toString(),
    value: size.toString(),
  }));

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${className}`}
    >
      {showControls && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Select
            label="Afficher"
            value={itemsPerPage.toString()}
            onChange={(val) => setItemsPerPage(parseInt(val, 10))}
            options={pageSizeSelectOptions}
            className="w-32"
          />
          <div className="text-sm text-gray-600">
            {paginatedData.length} sur {data.length} {itemLabel}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader columns={columns} />
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <svg
                      className="w-12 h-12 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={keyExtractor(item)} className="hover:bg-gray-50 transition">
                  {renderRow(item, index)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          hasMore={currentPage * itemsPerPage < data.length}
          onNext={() => setCurrentPage((prev) => prev + 1)}
          onPrev={() => setCurrentPage((prev) => prev - 1)}
        />
      )}
    </div>
  );
}
