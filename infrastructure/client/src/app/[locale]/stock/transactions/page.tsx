"use client";

import { TransactionList } from "@/components/stocks/transactions/TransactionList";
import { useUserTransactions } from "@/hooks/useStockTransactions";
import { useTranslations } from "next-intl";


export default function TransactionsPage() {
  const t = useTranslations("pages.stock.transactions");
  const { data: transactions, isLoading, error } = useUserTransactions();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t("title")}</h1>
          <p className="text-center text-gray-500">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t("title")}</h1>
          <p className="text-center text-red-500">
            {t("errorLoading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t("title")}</h1>
        <TransactionList transactions={transactions || []} />
      </div>
    </div>
  );
}