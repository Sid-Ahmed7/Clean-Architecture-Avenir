import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

interface EditStockFieldsProps {
  form: UseFormReturn<{ id: string; companyName: string; name: string; currency: string; isActionAvailable: boolean }>;
}

export function EditStockFields({ form }: EditStockFieldsProps) {
  const { control, formState: { errors } } = form;
  const t = useTranslations("components.stocks.forms");

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
          {t("fields.currency")} <span className="text-red-500">*</span>
        </label>
        <Controller
          name="currency"
          control={control}
          rules={{
            required: t("validation.currencyRequired"),
            minLength: { value: 3, message: t("validation.currencyLength") },
            maxLength: { value: 3, message: t("validation.currencyLength") }
          }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder={t("fields.currencyPlaceholder")}
              maxLength={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            />
          )}
        />
        {errors.currency && (
          <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">{t("fields.currencyHelp")}</p>
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
          {t("fields.isActionAvailable")}
        </label>
      </div>
    </>
  );
}