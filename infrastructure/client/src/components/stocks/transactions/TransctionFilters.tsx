import { Select } from "@/components/ui/Select";
import { TransactionType } from "@/types/transaction";
import { useTranslations } from 'next-intl';

interface TransactionFiltersProps {
    typeFilters: "ALL" | TransactionType;
    onTypeChange: (type: "ALL" | TransactionType) => void;
    symbolFilter: string;
    onSymbolChange: (symbol: string) => void;
}

export function TransactionFilters({typeFilters, onTypeChange, symbolFilter, onSymbolChange}: TransactionFiltersProps) {
 const t = useTranslations('components.stocks.transactions.filters');
 return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <Select<"ALL" | TransactionType>
          label={t('type')}
          value={typeFilters}
          onChange={onTypeChange}
          options={[
            { label: t('allTypes'), value: "ALL" },
            { label: t('buys'), value: TransactionType.BUY },
            { label: t('sells'), value: TransactionType.SELL },
          ]}
          className=""
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('symbol')}
          </label>
          <input
            type="text"
            value={symbolFilter}
            onChange={(e) => onSymbolChange(e.target.value)}
            placeholder={t('symbolPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}