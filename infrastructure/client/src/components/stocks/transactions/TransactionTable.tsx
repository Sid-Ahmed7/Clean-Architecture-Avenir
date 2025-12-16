"use client";

import { Pagination } from "@/components/ui/Pagination";
import { UserTransaction } from "@/types/transaction";
import { useEffect, useMemo, useState } from "react";
import { TransactionTableControls } from "./TransactionTableControls";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionTableRow } from "./TransactionTableRow";

interface TransactionTableProps {
  transactions: UserTransaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transactions.slice(startIndex, startIndex + itemsPerPage);
  }, [transactions, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, transactions]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <TransactionTableControls
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        currentCount={paginatedTransactions.length}
        totalCount={transactions.length}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TransactionTableHeader />
          <tbody className="divide-y divide-gray-100">
            {paginatedTransactions.map((tx) => (
              <TransactionTableRow key={tx.id} transaction={tx} />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        hasMore={currentPage * itemsPerPage < transactions.length}
        onNext={() => setCurrentPage((prev) => prev + 1)}
        onPrev={() => setCurrentPage((prev) => prev - 1)}
      />
    </div>
  );
}
