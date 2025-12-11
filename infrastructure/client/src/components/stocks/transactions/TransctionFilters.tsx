import { TransactionType } from "@/types/transaction";

interface TransactionFiltersProps {
    typeFilters: "ALL" | TransactionType;
    onTypeChange: (type: "ALL" | TransactionType) => void;
    symbolFilter: string;
    onSymbolChange: (symbol: string) => void;
}

export function TransactionFilters({typeFilters, onTypeChange, symbolFilter, onSymbolChange}: TransactionFiltersProps) {
      return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={typeFilters}
            onChange={(e) => onTypeChange(e.target.value as "ALL" | TransactionType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Tous les types</option>
            <option value="BUY">Achats</option>
            <option value="SELL">Ventes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Symbole
          </label>
          <input
            type="text"
            value={symbolFilter}
            onChange={(e) => onSymbolChange(e.target.value)}
            placeholder="Ex: AAPL"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}