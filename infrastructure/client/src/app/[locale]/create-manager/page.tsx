"use client";

import { apiClient } from "@/lib/api/apiClient";
import { CreateManagerInput, createManagerSchema } from "@/lib/validation/auth/createManagerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { AdminOnly } from "@/components/auth/RoleBasedAccess";

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
      } else {
        setMessage("Une erreur est survenue lors de la création du gestionnaire.");
      }
    } catch (error: any) {
      console.error("Error creating manager:", error);
      setMessage(error.response?.data?.error || "Erreur réseau. Vérifiez que le serveur est démarré.");
    }
  };

  return (
    <AdminOnly>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        {success ? (
          <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>{message}</p>
            </div>
            <Button
              onClick={() => router.push(`/${locale}/dashboard`)}
              variant="primary"
              fullWidth
            >
              Retour au tableau de bord
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-200"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center">
              Créer un gestionnaire bancaire
            </h2>

            <label className="block mb-1 font-medium text-gray-900" htmlFor="firstName">
              Prénom
            </label>
            <input
              id="firstName"
              {...register("firstName")}
              className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            />
            {errors.firstName && <p className="text-red-500 mb-2">{errors.firstName.message}</p>}

            <label className="block mb-1 font-medium text-gray-900" htmlFor="lastName">
              Nom
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            />
            {errors.lastName && <p className="text-red-500 mb-2">{errors.lastName.message}</p>}

            <label className="block mb-1 font-medium text-gray-900" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            />
            {errors.email && <p className="text-red-500 mb-2">{errors.email.message}</p>}

            <label className="block mb-1 font-medium text-gray-900" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              {...register("password")}
              type="password"
              className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            />
            {errors.password && <p className="text-red-500 mb-2">{errors.password.message}</p>}

            <label className="block mb-1 font-medium text-gray-900" htmlFor="phoneNumber">
              Numéro de téléphone
            </label>
            <input
              id="phoneNumber"
              {...register("phoneNumber")}
              type="tel"
              className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            />
            {errors.phoneNumber && <p className="text-red-500 mb-2">{errors.phoneNumber.message}</p>}

            <label className="block mb-1 font-medium text-gray-900" htmlFor="dateOfBirth">
              Date de naissance
            </label>
            <input
              id="dateOfBirth"
              {...register("dateOfBirth")}
              type="date"
              className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            />
            {errors.dateOfBirth && <p className="text-red-500 mb-2">{errors.dateOfBirth.message}</p>}

            <label className="block mb-1 font-medium text-gray-900" htmlFor="address">
              Adresse
            </label>
            <textarea
              id="address"
              {...register("address")}
              rows={3}
              className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            />
            {errors.address && <p className="text-red-500 mb-2">{errors.address.message}</p>}

            <Button type="submit" variant="primary" fullWidth>
              Créer le gestionnaire
            </Button>

            {message && !success && <p className="mt-4 text-center text-sm text-red-600 break-words">{message}</p>}
          </form>
        )}
      </div>
    </AdminOnly>
  );
}