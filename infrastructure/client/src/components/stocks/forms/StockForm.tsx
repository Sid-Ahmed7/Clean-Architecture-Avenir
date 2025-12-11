import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import { CreateStock } from "@/types/createStock";
import { StockFields } from "./StockFields";

interface CreateStockFormProps {
  onSubmit: (data: CreateStock) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function StockForm({ onSubmit, onCancel, isSubmitting }: CreateStockFormProps) {
  const form = useForm<CreateStock>({
    defaultValues: {
      symbol: "",
      companyName: "",
        name: "",
      currentPrice: 0,
      rateOfChange: 0,
      isActionAvailable: true,
      currency: "EUR",
      previousPrice: 0

    }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <StockFields form={form} />

      <div className="flex gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} fullWidth type="button">
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "Création..." : "Créer l'action"}
        </Button>
      </div>
    </form>
  );
}