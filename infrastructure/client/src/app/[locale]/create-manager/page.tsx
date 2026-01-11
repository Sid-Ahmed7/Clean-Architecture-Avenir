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
        setMessage("Le gestionnaire a été créé avec succès. Un email de confirmation a été envoyé.");
        setSuccess(true);
        reset();
      } else if (res.status === 409) {
        setMessage("Un utilisateur avec cet email existe déjà.");
      } else if (res.status === 403) {
        setMessage("Code secret invalide. Vous n'êtes pas autorisé à créer un gestionnaire.");
      } else {
        setMessage("Une erreur est survenue lors de la création du gestionnaire.");
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        setMessage("Code secret invalide. Vous n'êtes pas autorisé à créer un gestionnaire.");
      } else {
        setMessage(error.response?.data?.error || "Erreur réseau. Vérifiez que le serveur est démarré.");
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
            Se connecter
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
              Créer un gestionnaire bancaire
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Formulaire de création de compte gestionnaire
            </p>
          </div>

          <div className="gap-5 grid grid-cols-2">
            <Input
              label="Prénom"
              icon={User}
              variant="gradient"
              placeholder="Jean"
              error={errors.firstName?.message}
              {...register("firstName")}
            />

            <Input
              label="Nom"
              icon={User}
              variant="gradient"
              placeholder="Dupont"
              error={errors.lastName?.message}
              {...register("lastName")}
            />

            <Input
              label="Email"
              type="email"
              icon={Mail}
              variant="gradient"
              placeholder="jean.dupont@banque.fr"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Mot de passe"
              type="password"
              icon={Lock}
              variant="gradient"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
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

            <TextArea
              label="Adresse"
              rows={3}
              variant="gradient"
              placeholder="123 Rue de la Banque, 75001 Paris"
              error={errors.address?.message}
              {...register("address")}
            />

            <div className="pt-2">
              <Input
                label="Code Secret"
                type="password"
                icon={Shield}
                variant="gradient"
                placeholder="••••••••"
                helperText="Mot de passe manager requis pour créer un gestionnaire"
                error={errors.secretCode?.message}
                {...register("secretCode")}
              />
            </div>
          </div>

          <div className="mt-8">
            <Button type="submit" variant="primary" fullWidth>
              Créer le gestionnaire
            </Button>
          </div>

          {message && !success && <p className="mt-4 text-center text-sm text-red-600 break-words">{message}</p>}
        </form>
      )}
    </div>
  );
}
