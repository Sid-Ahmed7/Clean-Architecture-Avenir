"use client";

import { apiClient } from "@/lib/api/apiClient";
import { RegisterInput, registerSchema } from "@/lib/validation/auth/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { User, Mail, Lock, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useContext(LocaleContext);
  const [message, setMessage] = useState("");
  const t = useTranslations();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema(t))
  });

  const onSubmit = (data: RegisterInput) => {
    apiClient.post("/auth/register", data).then((res) => {
      if (res.status === 201) {
        setMessage(t("messages.register.success"));
        router.push(`/${locale}/confirm`);
      } else if (res.status === 409) {
        setMessage(t("messages.register.userExists"));
      } else {
        setMessage(t("messages.register.failure"));
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          {t("titles.register")}
        </h2>

        <div className="space-y-5">
          <Input
            label={t("labels.firstName")}
            icon={User}
            variant="gradient"
            placeholder="John"
            error={errors.firstName?.message}
            {...register("firstName")}
          />

          <Input
            label={t("labels.lastName")}
            icon={User}
            variant="gradient"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName")}
          />

          <Input
            label={t("labels.email")}
            type="email"
            icon={Mail}
            variant="gradient"
            placeholder="john.doe@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label={t("labels.password")}
            type="password"
            icon={Lock}
            variant="gradient"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label={t("labels.confirmPassword")}
            type="password"
            icon={CheckCircle}
            variant="gradient"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div className="mt-8">
          <Button type="submit" variant="primary" fullWidth>
            {t("labels.submit")}
          </Button>
        </div>

        {message && <p className="mt-4 text-center text-sm text-gray-600 break-words">{message}</p>}
      </form>
    </div>
  );
}