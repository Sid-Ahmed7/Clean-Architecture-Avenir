"use client";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthContext } from "@/contexts/AuthProvider";
import { login } from "@/lib/api/auth";
import { LoginInput, loginSchema } from "@/lib/validation/auth/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { Mail, Lock } from "lucide-react";
import { decodeJwt } from "@/lib/utils/decodeJwt";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useContext(LocaleContext);
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const t = useTranslations();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema(t)),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await login(data);

      if (res.status === 200) {
        const decodedToken = decodeJwt(res.data.token);
        const userRole = decodedToken?.role;

        // Set authentication state AND user data immediately
        setIsAuthenticated(true);
        setUser({
          userId: decodedToken?.userId || '',
          role: userRole || 'CLIENT'
        });

        const rolePrefixMap: Record<string, string> = {
          'CLIENT': 'client',
          'BANK_ADVISOR': 'advisor',
          'BANK_MANAGER': 'manager'
        };

        const rolePrefix = rolePrefixMap[userRole || 'CLIENT'] || 'client';

        // Redirect to role-specific dashboard
        router.push(`/${locale}/${rolePrefix}/dashboard`);
      } else if (res.status === 401) {
        setMessage(t("messages.login.invalid"));
      } else {
        setMessage(t("messages.login.failure"));
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setMessage("Email ou mot de passe incorrect");
      } else if (error.response?.status === 404) {
        setMessage("Utilisateur non trouvé");
      } else {
        setMessage(error.response?.data?.error || "Erreur de connexion");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          {t("titles.login")}
        </h2>

        <div className="space-y-6">
          <Input
            label={t("labels.email")}
            type="email"
            icon={Mail}
            variant="gradient"
            placeholder="exemple@email.com"
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
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600 break-words">{message}</p>
        )}

        <div className="mt-8">
          <Button type="submit" variant="primary" fullWidth>
            {t("labels.login")}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <Link href="/register" className="text-blue-700 hover:underline ml-1 font-semibold">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}