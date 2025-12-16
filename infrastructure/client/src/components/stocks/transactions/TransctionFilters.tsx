import { Select } from "@/components/ui/Select";
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
        
        <Select<"ALL" | TransactionType>
          label="Type"
          value={typeFilters}
          onChange={onTypeChange}
          options={[
            { label: "Tous les types", value: "ALL" },
            { label: "Achats", value: TransactionType.BUY },
            { label: "Ventes", value: TransactionType.SELL },
          ]}
          className=""
        />

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