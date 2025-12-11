import { Badge } from "@/components/ui/Badge";
import { OrderStatus } from "@/types/order";


interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
    [OrderStatus.PENDING]: { variant: "warning" as const, label: "En attente" },
    [OrderStatus.EXECUTED]: { variant: "success" as const, label: "Exécuté" },
    [OrderStatus.CANCELLED]: { variant: "danger" as const, label: "Annulé" },
    [OrderStatus.PARTIALLY_EXECUTED]: { variant: "info" as const, label: "Partiellement exécuté" },
    [OrderStatus.REJECTED]: { variant: "danger" as const, label: "Rejeté" }
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}