import { UserTransaction } from "@/types/transaction";
import { useTranslations } from 'next-intl';
import { useContext } from "react";
import { LocaleContext } from "@/contexts/LocaleProvider";

interface TransactionTableRowProps {
  transaction: UserTransaction;
}

export function TransactionTableRow({ transaction }: TransactionTableRowProps) {
  const t = useTranslations('components.stocks.transactions.row');
  const { locale } = useContext(LocaleContext);
  const isBuy = transaction.type === "BUY";
  const total = transaction.quantity * transaction.executionPrice;

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 font-semibold text-gray-900">
        {transaction.stockSymbol}
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {new Date(transaction.executedAt).toLocaleString(locale)}
      </td>

      <td className="px-6 py-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${isBuy
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {isBuy ? t('buy') : t('sell')}
        </span>
      </td>

      <td className="px-6 py-4 text-right font-medium">
        {transaction.quantity}
      </td>

      <td className="px-6 py-4 text-right">
        {transaction.executionPrice.toFixed(2)}€
      </td>

      <td className="px-6 py-4 text-right font-bold">
        <span className={isBuy ? "text-red-600" : "text-green-600"}>
          {isBuy ? "-" : "+"}
          {total.toFixed(2)}€
        </span>
      </td>
    </tr>
  );
}
