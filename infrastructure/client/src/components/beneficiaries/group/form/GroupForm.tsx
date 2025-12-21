
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { GroupFormFields } from "./GroupFormFields";
import { Beneficiary } from "@/types/beneficiary";
import { Save } from "lucide-react";
import { CreateBeneficiaryGroupRequest } from "@/types/beneficiaryGroup";
import { createBeneficiaryGroupSchema } from "@/lib/validation/beneficiary/createBeneficiaryGroupSchema";
import { useTranslations } from "next-intl";

interface GroupFormProps {
  initialData?: Partial<CreateBeneficiaryGroupRequest>;
  beneficiaries: Beneficiary[];
  onSubmit: (data: CreateBeneficiaryGroupRequest) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function GroupForm({initialData,beneficiaries,onSubmit,isLoading,}: GroupFormProps) {
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>(initialData?.beneficiaryIds || []);
  const t = useTranslations();

  const {register,handleSubmit,formState: { errors }} = useForm<CreateBeneficiaryGroupRequest>({
    resolver: zodResolver(createBeneficiaryGroupSchema(t)),
    defaultValues: initialData,
  });

  const handleBeneficiaryToggle = (beneficiaryId: string) => {
    setSelectedBeneficiaries(prev =>
      prev.includes(beneficiaryId)
        ? prev.filter(id => id !== beneficiaryId)
        : [...prev, beneficiaryId]
    );
  };

  const handleFormSubmit = (data: CreateBeneficiaryGroupRequest) => {
    onSubmit({
      ...data,
      beneficiaryIds: selectedBeneficiaries,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <GroupFormFields
        register={register}
        errors={errors}
        beneficiaries={beneficiaries}
        selectedBeneficiaries={selectedBeneficiaries}
        onBeneficiaryToggle={handleBeneficiaryToggle}
      />

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