import { createBeneficiarySchema } from "@/lib/validation/beneficiary/createBeneficiarySchema";
import { CreateBeneficiaryRequest } from "@/types/beneficiary";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BeneficiaryFormFields } from "./BeneficiaryFormFields";
import Button from "@/components/ui/Button";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";

interface BeneficiaryFormProps {
  initialData?: Partial<CreateBeneficiaryRequest>;
  onSubmit: (data: CreateBeneficiaryRequest) => void;
  isLoading?: boolean;
}

export function BeneficiaryForm({ initialData, onSubmit, isLoading }: BeneficiaryFormProps) {
  const t = useTranslations();

  const {register,handleSubmit,formState: { errors }} = useForm<CreateBeneficiaryRequest>({
    resolver: zodResolver(createBeneficiarySchema(t)),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <BeneficiaryFormFields register={register} errors={errors} />

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          icon={Save}
          loading={isLoading}
          fullWidth
        >
          Enregistrer
        </Button>
      </div>
    </form>
  );
}