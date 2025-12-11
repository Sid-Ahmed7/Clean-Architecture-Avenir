"use client";

import { OrderFields } from "@/types/orderFields";
import { Controller, UseFormReturn } from "react-hook-form";

interface OrderFormFieldsProps {
  form: UseFormReturn<OrderFields>;
  currentPrice: number;
}

export function OrderFormFields({form,currentPrice }: OrderFormFieldsProps) {
  const {control, formState: {errors}} = form;
  
  
    return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantité
        </label>
        <Controller
          name="quantity"
          control={control}
          rules={{
            required: "La quantité est requise",
            min: { value: 1, message: "La quantité doit être au moins 1" },
          }}
          render={({ field }) => (
            <input
              type="number"
              {...field}
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
          Prix par action (€)
        </label>
        <Controller
          name="orderPrice"
          control={control}
          rules={{
            required: "Le prix est requis",
            min: { value: 0.01, message: "Le prix doit être supérieur à 0" },
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
          Prix actuel du marché : {currentPrice.toFixed(2)}€
        </p>
      </div>
    </>
  );
}
