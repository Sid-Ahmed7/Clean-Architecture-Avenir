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
import { User, Mail, Lock, CheckCircle, Phone, Calendar, MapPin } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useContext(LocaleContext);
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
      const res = await apiClient.post("/auth/register", data);

      if (res.status === 201) {
        setMessage("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
        setTimeout(() => {
          router.push(`/${locale}/confirm`);
        }, 1500);
      } else if (res.status === 409) {
        setMessage("Un utilisateur avec cet email existe déjà.");
      } else {
        setMessage("Une erreur est survenue lors de l'inscription.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response?.status === 409) {
        setMessage("Un utilisateur avec cet email existe déjà.");
      } else {
        setMessage(error.response?.data?.error || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
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
          Créer un compte
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Prénom"
            icon={User}
            variant="gradient"
            placeholder="John"
            error={errors.firstName?.message}
            {...register("firstName")}
          />

          <Input
            label="Nom"
            icon={User}
            variant="gradient"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName")}
          />

          <Input
            label="Email"
            type="email"
            icon={Mail}
            variant="gradient"
            placeholder="john.doe@example.com"
            error={errors.email?.message}
            {...register("email")}
            className="md:col-span-2"
          />

          <Input
            label="Numéro de téléphone"
            type="tel"
            icon={Phone}
            variant="gradient"
            placeholder="+33 6 12 34 56 78"
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />

          <Input
            label="Date de naissance"
            type="date"
            icon={Calendar}
            variant="gradient"
            error={errors.dateOfBirth?.message}
            {...register("dateOfBirth")}
          />

          <Input
            label="Adresse"
            icon={MapPin}
            variant="gradient"
            placeholder="123 Rue de la Paix, 75001 Paris"
            error={errors.address?.message}
            {...register("address")}
            className="md:col-span-2"
          />

          <Input
            label="Mot de passe"
            type="password"
            icon={Lock}
            variant="gradient"
            placeholder="••••••••"
            helperText="Min. 8 caractères avec un caractère spécial"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirmer le mot de passe"
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
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm ${message.includes("succès") || message.includes("réussie")
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