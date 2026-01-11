import { Order } from "@/types/order";
import { DirectorOrderCard } from "./DirectorOrderCard";
import { useTranslations } from 'next-intl';

interface DirectorOrderListProps {
    orders: Order[];
}

export function DirectorOrderList({ orders }: DirectorOrderListProps) {
    const t = useTranslations('stocks.orders.directorList');
    
    const ordersBySymbol = orders.reduce((acc, order) => {
        if (!acc[order.stockSymbol]) {
            acc[order.stockSymbol] = [];
        }
        acc[order.stockSymbol].push(order);
        return acc;
    }, {} as Record<string, Order[]>);

    return (
        <div>
            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {t('noOrders')}
                    </h3>
                    <p className="text-gray-500">
                        {t('noOrdersDescription')}
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(ordersBySymbol).map(([symbol, symbolOrders]) => {
                        const buyOrders = symbolOrders.filter(o => o.orderType === "BUY");
                        const sellOrders = symbolOrders.filter(o => o.orderType === "SELL");

                        return (
                            <div key={symbol} className="bg-gray-50 rounded-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">{symbol}</h2>
                                    <div className="flex gap-4 text-sm">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                            {buyOrders.length} {buyOrders.length > 1 ? t('buyOrdersPlural') : t('buyOrders')}
                                        </span>
                                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                                            {sellOrders.length} {sellOrders.length > 1 ? t('sellOrdersPlural') : t('sellOrders')}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {symbolOrders.map((order) => (
                                        <DirectorOrderCard
                                            key={order.id}
                                            order={order}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
