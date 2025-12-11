"use client";

import { TransactionType, UserTransaction } from "@/types/transaction";
import { TransactionCard } from "./TransactionCard";
import { useState, useMemo } from "react";
import { TransactionFilters } from "./TransctionFilters";

interface TransactionListProps {
  transactions: UserTransaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [typeFilter, setTypeFilter] = useState<"ALL" | TransactionType>("ALL");
  const [symbolFilter, setSymbolFilter] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const typeMatch = typeFilter === "ALL" || transaction.type === typeFilter;
      const symbolMatch = symbolFilter === "" || 
        transaction.stockSymbol.toLowerCase().includes(symbolFilter.toLowerCase());
      return typeMatch && symbolMatch;
    });
  }, [transactions, typeFilter, symbolFilter]);

return (
  <div>
    {transactions.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-gray-500">Vous n'avez pas encore de transactions</p>
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
              Aucune transaction ne correspond aux filtres sélectionnés
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </>
    )}
  </div>
)
}
