import { OrderStatusEnum, OrderType } from "@/types/order";
import { Select, SelectOption } from "@/components/ui/Select";
import { useTranslations } from 'next-intl';

interface OrderFiltersProps {
    statusFilter: OrderStatusEnum | "ALL";
    onStatusFilterChange: (status: OrderStatusEnum | "ALL") => void;
    typeFilter : OrderType | "ALL";
    onTypeChange: (type: "ALL" | OrderType) =>  void;
}

export function OrderFilters({statusFilter, onStatusFilterChange, typeFilter, onTypeChange} : OrderFiltersProps) {
    const t = useTranslations('components.stocks.orders.filters');

    const statusOptions: SelectOption<OrderStatusEnum | "ALL">[] = [
      { value: "ALL", label: t('allStatuses') },
      { value: OrderStatusEnum.PENDING, label: t('pending') },
      { value: OrderStatusEnum.EXECUTED, label: t('executed') },
      { value: OrderStatusEnum.CANCELLED, label: t('cancelled') },
      { value: OrderStatusEnum.PARTIALLY_EXECUTED, label: t('partiallyExecuted') },
      { value: OrderStatusEnum.REJECTED, label: t('rejected') },
    ];

    const typeOptions: SelectOption<OrderType | "ALL">[] = [
      { value: "ALL", label: t('allTypes') },
      { value: OrderType.BUY, label: t('buy') },
      { value: OrderType.SELL, label: t('sell') },
    ];
    return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={t('status')}
          value={statusFilter}
          options={statusOptions}
          onChange={onStatusFilterChange}
        />

        <Select
          label={t('orderType')}
          value={typeFilter}
          options={typeOptions}
          onChange={onTypeChange}
        />
      </div>
    </div>
  );
}