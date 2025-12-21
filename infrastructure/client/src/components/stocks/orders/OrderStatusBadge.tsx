import { Badge } from "@/components/ui/Badge";
import { OrderStatusEnum } from "@/types/order";


interface OrderStatusEnumBadgeProps {
  status: OrderStatusEnum;
}

export function OrderStatusBadge({ status }: OrderStatusEnumBadgeProps) {
  const statusConfig = {
    [OrderStatusEnum.PENDING]: { variant: "warning" as const, label: "En attente" },
    [OrderStatusEnum.EXECUTED]: { variant: "success" as const, label: "Exécuté" },
    [OrderStatusEnum.CANCELLED]: { variant: "danger" as const, label: "Annulé" },
    [OrderStatusEnum.PARTIALLY_EXECUTED]: { variant: "info" as const, label: "Partiellement exécuté" },
    [OrderStatusEnum.REJECTED]: { variant: "danger" as const, label: "Rejeté" }
  };

const config = statusConfig[status];


return (
  <Badge variant={config ? config.variant : "warning"}>
    {config ? config.label : "Inconnu"}
  </Badge>
);


}