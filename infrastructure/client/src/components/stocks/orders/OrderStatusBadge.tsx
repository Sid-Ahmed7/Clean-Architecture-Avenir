import { Badge } from "@/components/ui/Badge";
import { OrderStatusEnum } from "@/types/order";
import { useTranslations } from 'next-intl';


interface OrderStatusEnumBadgeProps {
  status: OrderStatusEnum;
}

export function OrderStatusBadge({ status }: OrderStatusEnumBadgeProps) {
  const t = useTranslations('components.stocks.orders.statusBadge');
  
  const statusConfig = {
    [OrderStatusEnum.PENDING]: { variant: "warning" as const, label: t('pending') },
    [OrderStatusEnum.EXECUTED]: { variant: "success" as const, label: t('executed') },
    [OrderStatusEnum.CANCELLED]: { variant: "danger" as const, label: t('cancelled') },
    [OrderStatusEnum.PARTIALLY_EXECUTED]: { variant: "info" as const, label: t('partiallyExecuted') },
    [OrderStatusEnum.REJECTED]: { variant: "danger" as const, label: t('rejected') }
  };

const config = statusConfig[status];


return (
  <Badge variant={config ? config.variant : "warning"}>
    {config ? config.label : t('unknown')}
  </Badge>
);


}