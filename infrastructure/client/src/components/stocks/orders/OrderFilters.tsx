import { OrderStatusEnum, OrderType } from "@/types/order";
import { Select, SelectOption } from "@/components/ui/Select";

interface OrderFiltersProps {
    statusFilter: OrderStatusEnum | "ALL";
    onStatusFilterChange: (status: OrderStatusEnum | "ALL") => void;
    typeFilter : OrderType | "ALL";
    onTypeChange: (type: "ALL" | OrderType) =>  void;
}

const statusOptions: SelectOption<OrderStatusEnum | "ALL">[] = [
  { value: "ALL", label: "Tous les statuts" },
  { value: OrderStatusEnum.PENDING, label: "En attente" },
  { value: OrderStatusEnum.EXECUTED, label: "Exécuté" },
  { value: OrderStatusEnum.CANCELLED, label: "Annulé" },
  { value: OrderStatusEnum.PARTIALLY_EXECUTED, label: "Partiellement exécuté" },
  { value: OrderStatusEnum.REJECTED, label: "Rejeté" },
];

const typeOptions: SelectOption<OrderType | "ALL">[] = [
  { value: "ALL", label: "Tous les types" },
  { value: OrderType.BUY, label: "Achat" },
  { value: OrderType.SELL, label: "Vente" },
];

export function OrderFilters({statusFilter, onStatusFilterChange, typeFilter, onTypeChange} : OrderFiltersProps) {
    return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Statut"
          value={statusFilter}
          options={statusOptions}
          onChange={onStatusFilterChange}
        />

        <Select
          label="Type d'ordre"
          value={typeFilter}
          options={typeOptions}
          onChange={onTypeChange}
        />
      </div>
    </div>
  );
}