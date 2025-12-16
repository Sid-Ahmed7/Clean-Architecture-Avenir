import { useForm } from "react-hook-form";
import { EditStockFields } from "./EditStockFields";
import Button from "@/components/ui/Button";
import { Stocks } from "@/types/stocks";

interface EditStockFormProps {
  stock: Stocks;
  onSubmit: (data: { id: string; companyName: string; name: string; currency: string; isActionAvailable: boolean }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function EditStockForm({ stock, onSubmit, onCancel, isSubmitting }: EditStockFormProps) {
  const form = useForm<{ id: string; companyName: string; name: string; currency: string; isActionAvailable: boolean }>({
    defaultValues: {
      id: stock.id,
      companyName: stock.companyName,
      name: stock.name,
      currency: stock.currency,
      isActionAvailable: stock.isActionAvailable
    }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <EditStockFields form={form} />

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
          {isSubmitting ? "Modification..." : "Modifier l'action"}
        </Button>
      </div>
    </form>
  );
}