"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Stocks } from "@/types/stocks";

interface StockManagementTableProps {
  stocks: Stocks[];
  onEdit: (stock: Stocks) => void;
  onDelete: (stockId: string) => void;
  onToggleAvailability: (stockId: string, isAvailable: boolean) => void;
}

export function StockManagementTable({
  stocks,
  onEdit,
  onDelete,
  onToggleAvailability
}: StockManagementTableProps) {
  if (stocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">Aucune action créée</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbole
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entreprise
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix actuel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

              Variation              
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => (
              <tr key={stock.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{stock.companyName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{stock.currentPrice.toFixed(2)}€</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={stock.isActionAvailable ? "success" : "danger"}>
                    {stock.isActionAvailable ? "Disponible" : "Indisponible"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => onToggleAvailability(stock.id, !stock.isActionAvailable)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {stock.isActionAvailable ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    onClick={() => onEdit(stock)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Êtes-vous sûr de vouloir supprimer ${stock.symbol} ?`)) {
                        onDelete(stock.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}