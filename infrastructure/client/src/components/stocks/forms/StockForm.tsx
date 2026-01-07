import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import Button from "@/components/ui/Button";
import { CreateStock } from "@/types/createStock";
import { StockFields } from "./StockFields";

interface CreateStockFormProps {
  onSubmit: (data: CreateStock) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function StockForm({ onSubmit, onCancel, isSubmitting }: CreateStockFormProps) {
  const t = useTranslations('stocks.forms.stockForm');
  const form = useForm<CreateStock>({
    defaultValues: {
      symbol: "",
      companyName: "",
        name: "",
      currentPrice: 0,
      isActionAvailable: true,
      currency: "EUR",
    }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <StockFields form={form} />

      <div className="flex flex-col gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} fullWidth type="button">
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? t('creating') : t('create')}
        </Button>
      </div>
    </form>
  );
}