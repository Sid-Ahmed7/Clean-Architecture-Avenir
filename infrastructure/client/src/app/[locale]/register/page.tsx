"use client";

import { apiClient } from "@/lib/api/apiClient";
import { RegisterInput, registerSchema } from "@/lib/validation/auth/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { User, Mail, Lock, CheckCircle, Phone, Calendar, MapPin } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale(); 
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema(t))
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      setMessage("");
      const res = await apiClient.post("/auth/register", { ...data, locale });

      if (res.status === 201) {
        setMessage(t("auth.register.messages.success"));
        setTimeout(() => {
          router.push("/confirm");
        }, 1500);
      } else if (res.status === 409) {
        setMessage(t("auth.register.messages.userExists"));
      } else {
        setMessage(t("auth.register.messages.error"));
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response?.status === 409) {
        setMessage(t("auth.register.messages.userExists"));
      } else {
        setMessage(error.response?.data?.error || t("auth.register.messages.error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          {t("auth.register.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            className="md:col-span-2"
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

          <Input
            label={t("auth.register.address")}
            icon={MapPin}
            variant="gradient"
            placeholder={t("auth.register.placeholders.address")}
            error={errors.address?.message}
            {...register("address")}
            className="md:col-span-2"
          />

          <Input
            label={t("auth.register.password")}
            type="password"
            icon={Lock}
            variant="gradient"
            placeholder="••••••••"
            helperText={t("auth.register.passwordHelper")}
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label={t("auth.register.confirmPassword")}
            type="password"
            icon={CheckCircle}
            variant="gradient"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div className="mt-8">
          <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
            {isLoading ? t("auth.register.submitting") : t("auth.register.submit")}
          </Button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm ${message.includes(t("auth.register.messages.success").substring(0, 10))
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
            }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}