import { OrderStatusEnum } from "@/types/order";
import { useTranslations } from 'next-intl';

interface DirectorOrderFiltersProps {
    selectedStatus: OrderStatusEnum | "ALL";
    onStatusChange: (status: OrderStatusEnum | "ALL") => void;
    orderCounts: {
        all: number;
        pending: number;
        executed: number;
        partiallyExecuted: number;
        cancelled: number;
        rejected: number;
    };
}

export function DirectorOrderFilters({
    selectedStatus,
    onStatusChange,
    orderCounts
}: DirectorOrderFiltersProps) {
    const t = useTranslations('components.stocks.orders.directorFilters');
    
    const statusOptions = [
        { value: "ALL" as const, label: t('all'), count: orderCounts.all, color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
        { value: OrderStatusEnum.PENDING, label: t('pending'), count: orderCounts.pending, color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
        { value: OrderStatusEnum.EXECUTED, label: t('executed'), count: orderCounts.executed, color: "bg-green-100 text-green-700 hover:bg-green-200" },
        { value: OrderStatusEnum.PARTIALLY_EXECUTED, label: t('partiallyExecuted'), count: orderCounts.partiallyExecuted, color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
        { value: OrderStatusEnum.CANCELLED, label: t('cancelled'), count: orderCounts.cancelled, color: "bg-red-100 text-red-700 hover:bg-red-200" },
        { value: OrderStatusEnum.REJECTED, label: t('rejected'), count: orderCounts.rejected, color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
    ];

    return (
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('filterByStatus')}</h3>
            <div className="flex flex-wrap gap-3">
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onStatusChange(option.value)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            selectedStatus === option.value
                                ? option.color + " ring-2 ring-offset-2 ring-blue-500"
                                : option.color + " opacity-60"
                        }`}
                    >
                        {option.label}
                        <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-50 rounded-full text-xs">
                            {option.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
