"use client";

import Button from "@/components/ui/Button";
import { AuthContext } from "@/contexts/AuthProvider";
import { apiClient } from "@/lib/api/apiClient";
import { LoginInput, loginSchema } from "@/lib/validation/auth/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LocaleContext } from "@/contexts/LocaleProvider";



export default function LoginPage() {
  const router = useRouter();
  const { locale } = useContext(LocaleContext);
  const { setIsAuthenticated } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const t = useTranslations();


  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema(t)),
  });

  const onSubmit = (data: LoginInput) => {
    apiClient.post("/auth/login", data).then((res) => {
      if (res.status === 200) {
        setIsAuthenticated(true);
        setMessage(t("messages.login.success"));
        router.push(`/${locale}/dashboard`);
      } else if (res.status === 401) {
        setMessage(t("messages.login.invalid"));
      } else {
        setMessage(t("messages.login.failure"));
      }
    }).catch((error) => {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setMessage("Email ou mot de passe incorrect");
      } else if (error.response?.status === 404) {
        setMessage("Utilisateur non trouvé");
      } else {
        setMessage(error.response?.data?.error || "Erreur de connexion");
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center">
          {t("titles.login")}
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-900" htmlFor="email">
            {t("labels.email")}
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-900" htmlFor="password">
            {t("labels.password")}
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>



        {message && (
          <p className="mt-4 text-center text-sm text-gray-600 break-words">{message}</p>
        )}

        <Button type="submit" variant="primary" fullWidth>
          {t("labels.login")}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <Link href="/register" className="text-blue-700 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );


}