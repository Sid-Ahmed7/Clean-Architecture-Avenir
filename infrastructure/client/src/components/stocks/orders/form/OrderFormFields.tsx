"use client";

import { OrderFields } from "@/types/orderFields";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

interface OrderFormFieldsProps {
  form: UseFormReturn<OrderFields>;
  currentPrice: number;
}

export function OrderFormFields({form,currentPrice }: OrderFormFieldsProps) {
  const t = useTranslations("components.stocks.orderFormFields");
  const {control, formState: {errors}} = form;
  
  
    return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("quantity")}
        </label>
        <Controller
          name="quantity"
          control={control}
          rules={{
            required: t("validation.quantityRequired"),
            min: { value: 1, message: t("validation.quantityMin") },
          }}
          render={({ field }) => (
            <input
              type="number"
              step="1"
              min="1"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        />
        {errors.quantity && (
          <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("pricePerShare")}
        </label>
        <Controller
          name="orderPrice"
          control={control}
          rules={{
            required: t("validation.priceRequired"),
            min: { value: 0.01, message: t("validation.priceMin") },
          }}
          render={({ field }) => (
            <input
              type="number"
              step="0.01"
              {...field}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        />
        {errors.orderPrice && (
          <p className="text-red-500 text-xs mt-1">{errors.orderPrice.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {t("currentMarketPrice")}: {currentPrice.toFixed(2)}€
        </p>
      </div>
    </>
  );
}
