"use client";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthContext } from "@/contexts/AuthProvider";
import { login } from "@/lib/api/auth";
import { startTokenRefresh } from "@/lib/api/apiClient";
import { LoginInput, loginSchema } from "@/lib/validation/auth/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Mail, Lock, ShieldCheck, Zap, Clock, ArrowRight, Sparkles } from "lucide-react";
import { decodeJwt } from "@/lib/utils/decodeJwt";

export default function LoginPage() {
  const router = useRouter();
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
        const roles = res.data.roles as string[];
        const userId = res.data.user.id;

        // Determine highest priority role
        let userRole = 'CLIENT';
        if (roles.includes('BANK_MANAGER')) userRole = 'BANK_MANAGER';
        else if (roles.includes('BANK_ADVISOR')) userRole = 'BANK_ADVISOR';
        else if (roles.includes('CLIENT')) userRole = 'CLIENT';

        setIsAuthenticated(true);
        setUser({
          userId: userId,
          role: userRole
        });

        startTokenRefresh();

        const rolePrefixMap: Record<string, string> = {
          'CLIENT': 'client',
          'BANK_ADVISOR': 'advisor',
          'BANK_MANAGER': 'manager'
        };

        const rolePrefix = rolePrefixMap[userRole] || 'client';

        // Redirect to role-specific dashboard
        router.push(`/${rolePrefix}/dashboard`);
      } else if (res.status === 401) {
        setMessage(t("messages.login.invalid"));
      } else {
        setMessage(t("messages.login.failure"));
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setMessage(t("auth.login.errors.invalidCredentials"));
      } else if (error.response?.status === 404) {
        setMessage(t("auth.login.errors.userNotFound"));
      } else {
        setMessage(error.response?.data?.error || t("auth.login.errors.connectionError"));
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-70" />
        <div className="absolute left-[-8rem] bottom-0 h-80 w-80 rounded-full bg-indigo-100 blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.06),_transparent_35%)]" />
      </div>
      <div className="w-full max-w-6xl mx-auto px-4 py-10 md:py-16 relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-2xl border border-blue-800/40 p-8 space-y-6 min-h-[520px] flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs uppercase tracking-wide">
              <Sparkles className="h-4 w-4" />
              {t("auth.login.title") ?? t("titles.login")}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">{t("titles.login")}</h1>
              <p className="text-white/80 text-sm md:text-base">
                {t("auth.login.subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <ShieldCheck className="h-4 w-4" />
                  {t("auth.login.features.security.label")}
                </div>
                <p className="text-lg font-semibold">{t("auth.login.features.security.value")}</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Zap className="h-4 w-4" />
                  {t("auth.login.features.speed.label")}
                </div>
                <p className="text-lg font-semibold">{t("auth.login.features.speed.value")}</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Clock className="h-4 w-4" />
                  {t("auth.login.features.support.label")}
                </div>
                <p className="text-lg font-semibold">{t("auth.login.features.support.value")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <div className="h-10 w-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                <ArrowRight className="h-5 w-5" />
              </div>
              <p>{t("auth.login.premium")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-auto text-sm text-white/80">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <p className="font-semibold text-white">{t("auth.login.stats.clients.value")}</p>
                <p className="text-xs text-white/70">{t("auth.login.stats.clients.label")}</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <p className="font-semibold text-white">{t("auth.login.stats.rating.value")}</p>
                <p className="text-xs text-white/70">{t("auth.login.stats.rating.label")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10 min-h-[520px] flex flex-col justify-center">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 text-center">
                {t("titles.login")}
              </h2>
              <p className="text-center text-sm text-slate-500">
                {t("auth.login.formSubtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

              {message && (
                <p className="text-center text-sm text-red-500 break-words">{message}</p>
              )}

              <div className="pt-2">
                <Button type="submit" variant="primary" fullWidth>
                  {t("labels.login")}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              {t("auth.login.noAccount")}
              <Link href="/register" className="text-blue-700 hover:underline ml-1 font-semibold">
                {t("auth.login.register")}
              </Link>
              <span className="mx-2">·</span>
              <Link href="/" className="text-blue-700 hover:underline font-semibold">
                {t("nav.home")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}