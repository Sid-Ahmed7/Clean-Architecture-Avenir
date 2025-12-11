"use client";

import { TransactionList } from "@/components/stocks/transactions/TransactionList";
import { useUserTransactions } from "@/hooks/useStockTransactions";


export default function TransactionsPage() {
  const { data: transactions, isLoading, error } = useUserTransactions();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes transactions</h1>
          <p className="text-center text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes transactions</h1>
          <p className="text-center text-red-500">
            Erreur lors du chargement des transactions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes transactions</h1>
        <TransactionList transactions={transactions || []} />
      </div>
    </div>
  );
}