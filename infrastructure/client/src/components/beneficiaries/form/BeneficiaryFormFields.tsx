import { Input } from "@/components/ui/Input";
import { CreateBeneficiaryRequest } from "@/types/beneficiary";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface BeneficiaryFormFieldsProps {
  register: UseFormRegister<CreateBeneficiaryRequest>;
  errors: FieldErrors<CreateBeneficiaryRequest>;
}

export function BeneficiaryFormFields({ register, errors }: BeneficiaryFormFieldsProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Nom du bénéficiaire"
        {...register("beneficiaryName")}
        error={errors.beneficiaryName?.message}
        placeholder="Jean Dupont"
      />

      <Input
        label="IBAN"
        {...register("iban")}
        error={errors.iban?.message}
        placeholder="FR76 1234 5678 9012 3456 7890 123"
      />

      <Input
        label="Email (optionnel)"
        type="email"
        {...register("email")}
        error={errors.email?.message}
        placeholder="jean.dupont@example.com"
      />

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">Adresse (optionnel)</h3>

        <Input
          label="Rue"
          {...register("address.street")}
          error={errors.address?.street?.message}
          placeholder="123 Rue de la Paix"
        />

        <Input
          label="Ville"
          {...register("address.city")}
          error={errors.address?.city?.message}
          placeholder="Paris"
        />

        <Input
          label="Code postal"
          {...register("address.postalCode")}
          error={errors.address?.postalCode?.message}
          placeholder="75001"
        />

        <Input
          label="Pays"
          {...register("address.country")}
          error={errors.address?.country?.message}
          placeholder="France"
        />
      </div>
    </div>
  );
}