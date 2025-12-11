import { OrderStatus, OrderType } from "@/types/order";

interface OrderFiltersProps {
    statusFilter: OrderStatus | "ALL";
    onStatusFilterChange: (status: OrderStatus | "ALL") => void;
    typeFilter : OrderType | "ALL";
    onTypeChange: (type: "ALL" | OrderType) =>  void;
}

export function OrderFilters({statusFilter, onStatusFilterChange, typeFilter, onTypeChange} : OrderFiltersProps) {
    return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as OrderStatus | "ALL")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Tous les statuts</option>
            <option value={OrderStatus.PENDING}>En attente</option>
            <option value={OrderStatus.EXECUTED}>Exécuté</option>
            <option value={OrderStatus.CANCELLED}>Annulé</option>
            <option value={OrderStatus.PARTIALLY_EXECUTED}>Partiellement exécuté</option>
            <option value={OrderStatus.REJECTED}>Rejeté</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'ordre
          </label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value as "ALL" | OrderType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Tous les types</option>
            <option value="BUY">Achat</option>
            <option value="SELL">Vente</option>
          </select>
        </div>
      </div>
    </div>
  );
}