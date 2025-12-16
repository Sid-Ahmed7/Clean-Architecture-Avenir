import { CreateStock } from "@/types/createStock";
import { Controller, UseFormReturn } from "react-hook-form";

interface CreateStockFieldsProps {
  form: UseFormReturn<CreateStock>;
}

export function StockFields({ form }: CreateStockFieldsProps) {
  const { control, formState: { errors } } = form;

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Symbole <span className="text-red-500">*</span>
        </label>
        <Controller
          name="symbol"
          control={control}
          rules={{
            required: "Le symbole est requis",
            pattern: {
              value: /^[A-Z]{1,5}$/,
              message: "Le symbole doit contenir 1-5 lettres majuscules"
            }
          }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder="Ex: AAPL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            />
          )}
        />
        {errors.symbol && (
          <p className="text-red-500 text-xs mt-1">{errors.symbol.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom de l&apos;entreprise <span className="text-red-500">*</span>
        </label>
        <Controller
          name="companyName"
          control={control}
          rules={{ required: "Le nom est requis" }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder="Ex: Apple Inc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        />
        {errors.companyName && (
          <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom <span className="text-red-500">*</span>
        </label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Le nom est requis" }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder="Ex: Apple"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prix initial (€) <span className="text-red-500">*</span>
        </label>
        <Controller
          name="currentPrice"
          control={control}
          rules={{
            required: "Le prix initial est requis",
            min: { value: 0.01, message: "Le prix doit être supérieur à 0" }
          }}
          render={({ field }) => (
            <input
              type="number"
              step="0.01"
              {...field}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                field.onChange(isNaN(value) ? 0 : value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        />
        {errors.currentPrice && (
          <p className="text-red-500 text-xs mt-1">{errors.currentPrice.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Devise <span className="text-red-500">*</span>
        </label>
        <Controller
          name="currency"
          control={control}
          rules={{ required: "La devise est requise" }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder="Ex: EUR"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            />
          )}
        />
        {errors.currency && (
          <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantité totale d&apos;actions <span className="text-red-500">*</span>
        </label>
        <Controller
          name="totalShares"
          control={control}
          rules={{
            required: "La quantité totale est requise",
            min: { value: 1, message: "La quantité doit être au moins 1" }
          }}
          render={({ field }) => (
            <input
              type="number"
              step="1"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                field.onChange(isNaN(value) ? 0 : value);
              }}
              placeholder="Ex: 1000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        />
        {errors.totalShares && (
          <p className="text-red-500 text-xs mt-1">{errors.totalShares.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Nombre total d&apos;actions disponibles pour cette entreprise
        </p>
      </div>

      <div className="flex items-center mb-4">
        <Controller
          name="isActionAvailable"
          control={control}
          render={({ field: { value, onChange, onBlur, name, ref } }) => (
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              name={name}
              ref={ref}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          )}
        />
        <label className="ml-2 text-sm text-gray-700">
          Action disponible à l&apos;achat
        </label>
      </div>
    </>
  );
}
