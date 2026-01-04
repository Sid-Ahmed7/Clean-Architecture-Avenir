import { Input } from "@/components/ui/Input";
import { CreateBeneficiaryRequest } from "@/types/beneficiary";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";

interface BeneficiaryFormFieldsProps {
  register: UseFormRegister<CreateBeneficiaryRequest>;
  errors: FieldErrors<CreateBeneficiaryRequest>;
}

export function BeneficiaryFormFields({ register, errors }: BeneficiaryFormFieldsProps) {
  const t = useTranslations('components.beneficiaries.form.fields');
  return (
    <div className="space-y-4">
      <Input
        label={t('beneficiaryName')}
        {...register("beneficiaryName")}
        error={errors.beneficiaryName?.message}
        placeholder="Jean Dupont"
      />

      <Input
        label={t('iban')}
        {...register("iban")}
        error={errors.iban?.message}
        placeholder="FR76 1234 5678 9012 3456 7890 123"
      />

      <Input
        label={t('country')}
        {...register("country")}
        error={errors.country?.message}
        placeholder="France"
      />

      <Input
        label={t('email')}
        type="email"
        {...register("email")}
        error={errors.email?.message}
        placeholder="jean.dupont@example.com"
      />

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">{t('address.title')}</h3>

        <Input
          label={t('address.street')}
          {...register("address.street")}
          error={errors.address?.street?.message}
          placeholder="123 Rue de la Paix"
        />

        <Input
          label={t('address.city')}
          {...register("address.city")}
          error={errors.address?.city?.message}
          placeholder="Paris"
        />

        <Input
          label={t('address.postalCode')}
          {...register("address.postalCode")}
          error={errors.address?.postalCode?.message}
          placeholder="75001"
        />
      </div>
    </div>
  );
}