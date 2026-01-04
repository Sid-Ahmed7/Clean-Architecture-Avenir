"use client";

import { TransactionType, UserTransaction } from "@/types/transaction";
import { useState, useMemo } from "react";
import { TransactionFilters } from "./TransctionFilters";
import { TransactionTable } from "./TransactionTable";
import { useTranslations } from 'next-intl';

interface TransactionListProps {
  transactions: UserTransaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const t = useTranslations('components.stocks.transactions.list');
  const [typeFilter, setTypeFilter] = useState<"ALL" | TransactionType>("ALL");
  const [symbolFilter, setSymbolFilter] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const typeMatch = typeFilter === "ALL" || (transaction.type && transaction.type === typeFilter);
      const symbolMatch = symbolFilter === "" ||
        transaction.stockSymbol.toLowerCase().includes(symbolFilter.toLowerCase());
      return typeMatch && symbolMatch;
    });
  }, [transactions, typeFilter, symbolFilter]);

return (
  <div>
    {transactions.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('noTransactions')}</p>
      </div>
    ) : (
      <>
        <TransactionFilters
          typeFilters={typeFilter}
          onTypeChange={setTypeFilter}
          symbolFilter={symbolFilter}
          onSymbolChange={setSymbolFilter}
        />

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {t('noMatchingTransactions')}
            </p>
          </div>
        ) : (
          <TransactionTable transactions={filteredTransactions} />
        )}
      </>
    )}
  </div>
)
}
