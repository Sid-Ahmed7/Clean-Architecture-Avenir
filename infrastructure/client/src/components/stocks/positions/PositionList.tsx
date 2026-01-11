import { PositionWithDetails } from "@/types/position";
import { useMemo } from "react";
import { PositionSummary } from "./PositionSummary";
import { PositionCard } from "./PositionCard";
import { useTranslations } from "next-intl";

interface PositionListProps {
  positions: PositionWithDetails[];
  onSell?: (symbol: string) => void;
}

export function PositionList({ positions, onSell }: PositionListProps) {
  const t = useTranslations('components.stocks.positions.list');

  const summary = useMemo(() => {
    const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
    const totalCost = positions.reduce((sum, pos) => sum + pos.totalInvested, 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost === 0 ? 0 : (totalGainLoss / totalCost) * 100;
    return { totalValue, totalCost, totalGainLoss, totalGainLossPercent };
  }, [positions]);

  return (
    <div>
      {positions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('noPositionsDesc')}</p>
        </div>
      ) : (
        <>
          <PositionSummary {...summary} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positions.map((position) => (
              <PositionCard
                key={position.stockSymbol}
                position={position}
                onSell={onSell}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
