"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Edit3 } from "lucide-react";
import { useAccountManagement } from "@/hooks/useAccountManagement";
import { updateAccountNameSchema, UpdateAccountNameInput } from "@/lib/validation/bankAccount/updateAccountNameSchema";

interface AccountNameFormProps {
  accountNumber: number;
  currentName: string;
  onSuccess?: () => void;
}

export function AccountNameForm({ accountNumber, currentName, onSuccess }: AccountNameFormProps) {
  const t = useTranslations("client.accountSettings.updateName");
  const { updateAccountName, loading } = useAccountManagement();

  const {register,handleSubmit,formState: { errors, isDirty },watch} = useForm<UpdateAccountNameInput>({
    resolver: zodResolver(updateAccountNameSchema),
    defaultValues: {
      customAccountName: currentName || "",
    },
  });

  const customAccountName = watch("customAccountName");

  const onSubmit = async (data: UpdateAccountNameInput) => {
    const result = await updateAccountName(accountNumber, data.customAccountName);

    if (result?.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label={t("label")}
          type="text"
          placeholder={t("placeholder")}
          maxLength={50}
          icon={Edit3}
          variant="gradient"
          error={errors.customAccountName?.message}
          {...register("customAccountName")}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading || !isDirty || customAccountName === currentName}
      >
        {t("button")}
      </Button>
    </form>
  );
}
