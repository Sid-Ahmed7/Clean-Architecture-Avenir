import { Controller, UseFormReturn } from "react-hook-form";

interface EditStockFieldsProps {
  form: UseFormReturn<{ id: string; companyName: string; name: string; currency: string; isActionAvailable: boolean }>;
}

export function EditStockFields({ form }: EditStockFieldsProps) {
  const { control, formState: { errors } } = form;

  return (
    <>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom de l&apos;entreprise <span className="text-red-500">*</span>
        </label>
        <Controller
          name="companyName"
          control={control}
          rules={{ required: "Le nom de l'entreprise est requis" }}
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
          Nom court <span className="text-red-500">*</span>
        </label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Le nom court est requis" }}
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
          Devise <span className="text-red-500">*</span>
        </label>
        <Controller
          name="currency"
          control={control}
          rules={{
            required: "La devise est requise",
            minLength: { value: 3, message: "La devise doit contenir exactement 3 caractères" },
            maxLength: { value: 3, message: "La devise doit contenir exactement 3 caractères" }
          }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder="Ex: EUR"
              maxLength={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            />
          )}
        />
        {errors.currency && (
          <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Code ISO de la devise (USD, EUR, GBP, etc.)</p>
      </div>

      <div className="flex items-center mb-4">
        <Controller
          name="isActionAvailable"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
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