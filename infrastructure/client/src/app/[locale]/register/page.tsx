"use client";

import { apiClient } from "@/lib/api/apiClient";
import { RegisterInput, registerSchema } from "@/lib/validation/auth/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useForm} from "react-hook-form";
import Button from "@/components/ui/Button";
import { useLocale, useTranslations } from "next-intl";


export default function RegisterPage() {
    const router = useRouter();
    const locale = useLocale()
    const [message, setMessage] = useState("");
    const t = useTranslations();

    const {register, handleSubmit, formState: {errors}} = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema(t))
    });

    const onSubmit = (data: RegisterInput) => {
        apiClient.post("/auth/register", data).then((res) => {
            if(res.status === 201) {
                setMessage(t("messages.register.success"));
                  router.push(`/${locale}/confirm`);
            } else if(res.status === 409) {
                setMessage(t("messages.register.userExists"));
            } else {
                setMessage(t("messages.register.failure"));
            }
        });
    };

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center">
          {t("titles.register")}
        </h2>

        <label className="block mb-1 font-medium text-gray-700" htmlFor="firstName">
          {t("labels.firstName")}
        </label>
        <input
          id="firstName"
          {...register("firstName")}
          className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.firstName && <p className="text-red-500 mb-2">{errors.firstName.message}</p>}

        <label className="block mb-1 font-medium text-gray-700" htmlFor="lastName">
          {t("labels.lastName")}
        </label>
        <input
          id="lastName"
          {...register("lastName")}
          className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.lastName && <p className="text-red-500 mb-2">{errors.lastName.message}</p>}

        <label className="block mb-1 font-medium text-gray-700" htmlFor="email">
          {t("labels.email")}
        </label>
        <input
          id="email"
          {...register("email")}
          type="email"
          className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.email && <p className="text-red-500 mb-2">{errors.email.message}</p>}

        <label className="block mb-1 font-medium text-gray-700" htmlFor="password">
          {t("labels.password")}
        </label>
        <input
          id="password"
          {...register("password")}
          type="password"
          className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.password && <p className="text-red-500 mb-2">{errors.password.message}</p>}

        <label className="block mb-1 font-medium text-gray-700" htmlFor="confirmPassword">
          {t("labels.confirmPassword")}
        </label>
        <input
          id="confirmPassword"
          {...register("confirmPassword")}
          type="password"
          className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.confirmPassword && <p className="text-red-500 mb-2">{errors.confirmPassword.message}</p>}

        <Button type="submit" variant="primary" fullWidth>
          {t("labels.submit")}
        </Button>

        {message && <p className="mt-4 text-center text-sm text-gray-600 break-words">{message}</p>}
      </form>
    </div>
  );
    

}