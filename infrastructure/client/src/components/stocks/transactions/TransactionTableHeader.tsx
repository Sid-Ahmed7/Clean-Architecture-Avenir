import { useTranslations } from 'next-intl';

export function TransactionTableHeader() {
  const t = useTranslations('components.stocks.transactions.tableHeader');
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
          {t('symbol')}
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
          {t('date')}
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
          {t('type')}
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
          {t('quantity')}
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
          {t('unitPrice')}
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
          {t('total')}
        </th>
      </tr>
    </thead>
  );
}
