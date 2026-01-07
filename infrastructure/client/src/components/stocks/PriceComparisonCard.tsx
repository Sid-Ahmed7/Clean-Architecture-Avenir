"use client";

import { comparePrices, formatPrice, getColorClasses } from "@/lib/utils/priceComparaison";
import { Currency } from "@/types/priceComparison";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface PriceComparaisonCardProps {
  marketPrice: number;
  marketCurrency: Currency;
  tradingPrice: number;
  tradingCurrency: Currency;
}

export function PriceComparisonCard({marketPrice,marketCurrency,tradingPrice,tradingCurrency}: PriceComparaisonCardProps) {
  const t = useTranslations("components.stocks.priceComparison");

  const comparison = useMemo(
    () => comparePrices(marketPrice, marketCurrency, tradingPrice, tradingCurrency),
    [marketPrice, marketCurrency, tradingPrice, tradingCurrency]
  );

  const colors = getColorClasses(comparison.indicatorColor);

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <h4 className={`font-semibold ${colors.text}`}>
          {t("title")}
        </h4>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">{t("marketPrice")}</span>
          <span className="font-medium">
            {formatPrice(marketPrice, marketCurrency)}
          </span>
        </div>

        {marketCurrency !== tradingCurrency && (
          <div className="flex justify-between">
            <span className="text-gray-500 text-xs">{t("convertedPrice")}</span>
            <span className="font-medium text-gray-500">
              ≈ {formatPrice(comparison.marketPriceConverted, tradingCurrency)}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">{t("tradingPrice")}</span>
          <span className="font-bold">
            {formatPrice(tradingPrice, tradingCurrency)}
          </span>
        </div>

        <div className="border-t border-gray-200 my-2" />

        <div className="flex justify-between">
          <span className="text-gray-600">{t("absoluteDiff")}</span>
          <span className={`font-bold ${colors.text}`}>
            {comparison.absoluteDifference >= 0 ? "+" : ""}
            {formatPrice(comparison.absoluteDifference, tradingCurrency)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">{t("percentageDiff")}</span>
          <span className={`font-bold ${colors.text}`}>
            {comparison.percentageDifference >= 0 ? "+" : ""}
            {comparison.percentageDifference.toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">{t("position")}</span>
          <span className={`font-semibold ${colors.text}`}>
            {comparison.isAboveMarket ? t("aboveMarket") : t("belowMarket")}
          </span>
        </div>
      </div>

      {comparison.isSignificantGap && (
        <div className={`mt-3 p-2 rounded ${comparison.isCriticalGap ? "bg-red-100" : "bg-orange-100"}`}>
          <p className={`text-xs font-medium ${comparison.isCriticalGap ? "text-red-800" : "text-orange-800"}`}>
            {comparison.isCriticalGap 
              ? t("criticalGapWarning", { gap: Math.abs(comparison.percentageDifference).toFixed(2) })
              : t("significantGapWarning", { gap: Math.abs(comparison.percentageDifference).toFixed(2) })
            }
          </p>
        </div>
      )}
    </div>
  );
}