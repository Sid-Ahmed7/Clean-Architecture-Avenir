import { Order, OrderStatusEnum, OrderType } from "@/types/order";
import { useMemo, useState } from "react";
import { OrderFilters } from "./OrderFilters";
import { OrderCard } from "./OrderCard";
import { useTranslations } from 'next-intl';

interface OrderListProps {
    orders: Order[];
    onCancel: (orderId: string) => void;
    isLoading: boolean;
}

export function OrderList({ orders, onCancel, isLoading }: OrderListProps) {
    const t = useTranslations('components.stocks.orders.list');
    const [statusFilter, setStatusFilter] = useState<OrderStatusEnum | "ALL">("ALL");
    const [typeFilter, setTypeFilter] = useState<OrderType | "ALL">("ALL");

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const statusMatch = statusFilter === "ALL" || order.status === statusFilter;
            const typeMatch = typeFilter === "ALL" || order.orderType === typeFilter;
            return statusMatch && typeMatch;
        });
    }, [orders, statusFilter, typeFilter]);


    return (

        <div>
            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">{t('noOrders')}</p>
                </div>
            ):(
                <OrderFilters 
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                />
            )}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t('noMatchingOrders')}</p>
                    </div>
                ):(
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => (
                        <OrderCard
                        key={order.id}
                        order={order}
                        onCancel={onCancel}
                        isLoading={isLoading}
                        />
                    ))}
                    </div> 
                )}
        </div>
    )


}