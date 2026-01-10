"use client";

import { apiClient } from "@/lib/api/apiClient";
import { RegisterInput, registerSchema } from "@/lib/validation/auth/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { User, Mail, Lock, CheckCircle, Phone, Calendar, MapPin, Sparkles, ShieldCheck, Zap, ArrowRight } from "lucide-react";

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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-70" />
        <div className="absolute left-[-10rem] bottom-[-4rem] h-80 w-80 rounded-full bg-indigo-100 blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.06),_transparent_35%)]" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16 relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-2xl border border-blue-800/40 p-8 space-y-6 min-h-[560px] flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs uppercase tracking-wide">
              <Sparkles className="h-4 w-4" />
              {t("auth.register.title")}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">{t("auth.register.title")}</h1>
              <p className="text-white/80 text-sm md:text-base">
                Ouvrez votre compte en quelques instants : identité, coordonnées, sécurité. Nous préparons tout pour vous.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <ShieldCheck className="h-4 w-4" />
                  Sécurité
                </div>
                <p className="text-lg font-semibold">KYC simplifié</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Zap className="h-4 w-4" />
                  Rapidité
                </div>
                <p className="text-lg font-semibold"><span className="align-middle">≈</span>5 min</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <ArrowRight className="h-4 w-4" />
                  Accès
                </div>
                <p className="text-lg font-semibold">Dashboard direct</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-auto text-sm text-white/80">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <p className="font-semibold text-white">+2M clients</p>
                <p className="text-xs text-white/70">satisfaits en Europe</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <p className="font-semibold text-white">4.8/5</p>
                <p className="text-xs text-white/70">sur l’App Store</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10 min-h-[560px] flex flex-col justify-center">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 text-center">
                {t("auth.register.title")}
              </h2>
              <p className="text-center text-sm text-slate-500">
                Créez votre espace et bénéficiez de tous nos services en ligne.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <div className="pt-2 space-y-3">
              <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                {isLoading ? t("auth.register.submitting") : t("auth.register.submit")}
              </Button>
              <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 text-sm text-slate-600">
                <span>{t("auth.login.noAccount")}</span>
                <div className="flex gap-3"><Link href="/login" className="text-blue-700 hover:underline font-semibold">
                    {t("nav.login")}
                  </Link>
                  <Link href="/" className="text-blue-700 hover:underline font-semibold">
                    {t("nav.home")}
                  </Link>
                  
                </div>
              </div>
            </div>

              {message && (
                <div className={`p-3 rounded-lg text-center text-sm ${message.includes(t("auth.register.messages.success").substring(0, 10))
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                  }`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}