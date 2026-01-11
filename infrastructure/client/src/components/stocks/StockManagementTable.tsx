"use client";

import { Badge } from "@/components/ui/Badge";
import { Stocks } from "@/types/stocks";
import { useTranslations } from "next-intl";

interface StockManagementTableProps {
  stocks: Stocks[];
  onEdit: (stock: Stocks) => void;
  onDelete: (stockId: string) => void;
  onToggleAvailability: (stockId: string, isAvailable: boolean) => void;
  onOpenIPO: (stock: Stocks) => void;
  onCloseIPO: (symbol: string) => void;
}

export function StockManagementTable({stocks,onEdit,onDelete,onToggleAvailability,onOpenIPO,onCloseIPO}: StockManagementTableProps) {
  const t = useTranslations("stocks.table");
  
  if (stocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">{t("noStocks")}</p>
      </div>
    );
  }

return (
  <div className="max-w-7xl mx-auto">
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("symbol")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("company")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("previousPrice")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("currentPrice")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("variation")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("ipoActive")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {stocks.map((stock, index) => (
              <tr
                key={stock.id}
                className={`transition duration-150 hover:bg-gray-100 ${
                  index % 2 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {stock.symbol}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-[12rem] truncate">
                  {stock.companyName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {stock.previousPrice
                    ? `${stock.previousPrice.toFixed(2)}€`
                    : "-"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-lg text-right font-bold text-indigo-600">
                  {stock.currentPrice.toFixed(2)}€
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div
                    className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                      (stock.rateOfChange ?? 0) > 0
                        ? "bg-green-100 text-green-600"
                        : (stock.rateOfChange ?? 0) < 0
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {(stock.rateOfChange ?? 0) > 0 ? "+" : ""}
                    {(stock.rateOfChange ?? 0).toFixed(2)}%
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Badge variant={stock.isActionAvailable ? "success" : "danger"}>
                    {stock.isActionAvailable ? t('available') : t('unavailable')}
                  </Badge>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {stock.ipoActive && stock.availableSharesForIPO > 0 ? (
                    <div className="space-y-1">
                      <Badge variant="warning">
                        {t('ipoActive')}
                      </Badge>
                      <p className="text-xs text-gray-600">
                        {stock.availableSharesForIPO} {t('shares')}
                      </p>
                      <button
                        onClick={() => onCloseIPO(stock.symbol)}
                        className="text-xs font-medium text-red-600 hover:text-red-800 transition"
                      >
                        {t('closeIPO')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenIPO(stock)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 transition px-3 py-1 border border-blue-300 rounded-lg hover:bg-blue-50"
                    >
                      {t('openIPO')}
                    </button>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center text-sm space-x-3">
                  <button
                    onClick={() =>
                      onToggleAvailability(stock.id, !stock.isActionAvailable)
                    }
                    className={`font-medium transition ${
                      stock.isActionAvailable
                        ? "text-yellow-600 hover:text-yellow-800"
                        : "text-emerald-600 hover:text-emerald-800"
                    }`}
                  >
                    {stock.isActionAvailable ? t('deactivate') : t('activate')}
                  </button>

                  <button
                    onClick={() => onEdit(stock)}
                    className="font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    {t('edit')}
                  </button>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          t('confirmDelete', { symbol: stock.symbol })
                        )
                      ) {
                        onDelete(stock.id);
                      }
                    }}
                    className="font-medium text-red-600 hover:text-red-800 transition"
                  >
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

}