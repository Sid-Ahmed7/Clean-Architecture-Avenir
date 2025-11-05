"use client";

import { useCreateSubAccount } from "@/lib/hooks/useCreateSubAccount";
import { CreateSubAccountModel, createSubAccountSchema } from "@/lib/validation/bankAccount/createSubAccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiggyBank } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";



interface SubAccountsFormProps {
    parentAccountId: number;
}

export default function SubAccountForm(props: SubAccountsFormProps) {
    const {parentAccountId} = props;
    const t = useTranslations();
    const {createSubAccount, loading, error, success} = useCreateSubAccount();
    const accountTypes = [
        { value: "SAVINGS", label: "Épargne", icon: PiggyBank },
    ]

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateSubAccountModel>({
        resolver: zodResolver(createSubAccountSchema(t)),
        defaultValues: {
            accountType: "SAVINGS", 
            currency: "EUR",
            customAccountName: "",
            parentAccountId: parentAccountId
        }
    });

   const onSubmit = async  (data: CreateSubAccountModel) => {
        createSubAccount({ ...data, parentAccountId });
    };

    const selectedType = watch("accountType");



 return (
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un sous-compte</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du compte *</label>
          <input
            type="text"
            {...register("customAccountName")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Nom du sous-compte"
          />
          {errors.customAccountName && <p className="text-red-500 text-sm mt-1">{errors.customAccountName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de compte *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {accountTypes.map(type => {
              const TypeIcon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setValue("accountType", type.value as CreateSubAccountModel["accountType"])}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    selectedType === type.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <TypeIcon className="w-6 h-6" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Devise *</label>
          <select
            {...register("currency")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            {loading ? "Création..." : "Créer le sous-compte"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">Sous-compte créé avec succès !</p>}
      </form>
    </div>
  );
}
       

