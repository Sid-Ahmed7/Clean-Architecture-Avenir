import { CreateStock } from "@/types/createStock";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

interface CreateStockFieldsProps {
  form: UseFormReturn<CreateStock>;
}

export function StockFields({ form }: CreateStockFieldsProps) {
  const { control, formState: { errors } } = form;
  const t = useTranslations("stocks.forms");

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t("fields.symbol")} <span className="text-red-500">*</span>
        </label>
        <Controller
          name="symbol"
          control={control}
          rules={{
            required: t("validation.symbolRequired"),
            pattern: {
              value: /^[A-Z]{1,5}$/,
              message: t("validation.symbolPattern")
            }
          }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder={t("fields.symbolPlaceholder")}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-200 uppercase transition"
            />
          )}
        />
        {errors.symbol && (
          <p className="text-red-500 text-xs mt-1">{errors.symbol.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t("fields.companyName")} <span className="text-red-500">*</span>
        </label>
        <Controller
          name="companyName"
          control={control}
          rules={{ required: t("validation.companyNameRequired") }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder={t("fields.companyNamePlaceholder")}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-200 transition"
            />
          )}
        />
        {errors.companyName && (
          <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t("fields.name")} <span className="text-red-500">*</span>
        </label>
        <Controller
          name="name"
          control={control}
          rules={{ required: t("validation.nameRequired") }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder={t("fields.namePlaceholder")}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-200 transition"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t("fields.initialPrice")} <span className="text-red-500">*</span>
        </label>
        <Controller
          name="currentPrice"
          control={control}
          rules={{
            required: t("validation.priceRequired"),
            min: { value: 0.01, message: t("validation.priceMin") }
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
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-200 transition"
            />
          )}
        />
        {errors.currentPrice && (
          <p className="text-red-500 text-xs mt-1">{errors.currentPrice.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t("fields.currency")} <span className="text-red-500">*</span>
        </label>
        <Controller
          name="currency"
          control={control}
          rules={{ required: t("validation.currencyRequired") }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder={t("fields.currencyPlaceholder")}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-200 uppercase transition"
            />
          )}
        />
        {errors.currency && (
          <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t("fields.totalShares")} <span className="text-red-500">*</span>
        </label>
        <Controller
          name="totalShares"
          control={control}
          rules={{
            required: t("validation.totalSharesRequired"),
            min: { value: 1, message: t("validation.totalSharesMin") }
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
              placeholder={t("fields.totalSharesPlaceholder")}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-200 transition"
            />
          )}
        />
        {errors.totalShares && (
          <p className="text-red-500 text-xs mt-1">{errors.totalShares.message}</p>
        )}
        <p className="text-xs text-slate-500 mt-1">
          {t("fields.totalSharesHelp")}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
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
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
          )}
        />
        <label className="text-sm text-slate-700">
          {t("fields.isActionAvailable")}
        </label>
      </div>
    </>
  );
}
