"use client";

import { apiClient } from "@/lib/api/apiClient";
import { CreateManagerInput, createManagerSchema } from "@/lib/validation/auth/createManagerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { useTranslations } from "next-intl";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { User, Mail, Lock, Phone, Calendar, Briefcase, Shield } from "lucide-react";

export default function CreateManagerPage() {
  const router = useRouter();
  const { locale } = useContext(LocaleContext);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const t = useTranslations();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateManagerInput>({
    resolver: zodResolver(createManagerSchema(t))
  });

  const onSubmit = async (data: CreateManagerInput) => {
    try {
      const res = await apiClient.post("/auth/create-manager", data);
      if (res.status === 201) {
        setMessage(t("auth.createManager.success"));
        setSuccess(true);
        reset();
      } else if (res.status === 409) {
        setMessage(t("auth.createManager.userExists"));
      } else if (res.status === 403) {
        setMessage(t("auth.createManager.invalidSecretCode"));
      } else {
        setMessage(t("auth.createManager.error"));
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        setMessage(t("auth.createManager.invalidSecretCode"));
      } else {
        setMessage(error.response?.data?.error || t("auth.createManager.error"));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8">
      {success ? (
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
          <div className="bg-green-50 border-2 border-green-400 text-green-800 px-6 py-4 rounded-xl mb-6">
            <p className="font-semibold">{message}</p>
          </div>
          <Button
            onClick={() => router.push(`/${locale}/login`)}
            variant="primary"
            fullWidth
          >
            {t("auth.createManager.loginButton")}
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-100"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("auth.createManager.title")}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {t("auth.createManager.subtitle")}
            </p>
          </div>

          <div className="gap-5 grid grid-cols-2">
            <Input
              label={t("auth.register.firstName")}
              icon={User}
              variant="gradient"
              placeholder={t("auth.register.placeholders.firstName")}
              error={errors.firstName?.message}
              {...register("firstName")}
            />

            <Input
              label={t("auth.register.lastName")}
              icon={User}
              variant="gradient"
              placeholder={t("auth.register.placeholders.lastName")}
              error={errors.lastName?.message}
              {...register("lastName")}
            />

            <Input
              label={t("auth.register.email")}
              type="email"
              icon={Mail}
              variant="gradient"
              placeholder={t("auth.register.placeholders.email")}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
             label={t("auth.register.password")}
              type="password"
              icon={Lock}
              variant="gradient"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label={t("auth.register.phoneNumber")}
              type="tel"
              icon={Phone}
              variant="gradient"
              placeholder={t("auth.register.placeholders.phone")}
              error={errors.phoneNumber?.message}
              {...register("phoneNumber")}
            />

            <Input
              label={t("auth.register.dateOfBirth")}
              type="date"
              icon={Calendar}
              variant="gradient"
              error={errors.dateOfBirth?.message}
              {...register("dateOfBirth")}
            />

            <TextArea
              label={t("auth.register.address")}
              rows={3}
              variant="gradient"
              placeholder={t("auth.register.placeholders.address")}
              error={errors.address?.message}
              {...register("address")}
            />

            <div className="pt-2">
              <Input
                label={t("auth.createManager.secretCodeLabel")}
                type="password"
                icon={Shield}
                variant="gradient"
                placeholder="••••••••"
                helperText={t("auth.createManager.secretCodeHelper")}
                error={errors.secretCode?.message}
                {...register("secretCode")}
              />
            </div>
          </div>

          <div className="mt-8">
            <Button type="submit" variant="primary" fullWidth>
              {t("auth.createManager.submit")}
            </Button>
          </div>

          {message && !success && <p className="mt-4 text-center text-sm text-red-600 break-words">{message}</p>}
        </form>
      )}
    </div>
  );
}
