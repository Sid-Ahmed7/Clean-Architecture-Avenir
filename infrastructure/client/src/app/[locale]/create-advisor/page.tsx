"use client";

import { apiClient } from "@/lib/api/apiClient";
import { CreateAdvisorInput, createAdvisorSchema } from "@/lib/validation/auth/createAdvisorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { useTranslations } from "next-intl";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { BankManagerOnly } from "@/components/auth/RoleBasedAccess";
import { User, Mail, Lock, Phone, Calendar, UserCheck } from "lucide-react";

export default function CreateAdvisorPage() {
    const router = useRouter();
    const { locale } = useContext(LocaleContext);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const t = useTranslations();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateAdvisorInput>({
        resolver: zodResolver(createAdvisorSchema(t))
    });

    const onSubmit = async (data: CreateAdvisorInput) => {
        try {
            const res = await apiClient.post("/auth/create-advisor", data);
            if (res.status === 201) {
                setMessage("Le conseiller bancaire a été créé avec succès. Un email de confirmation a été envoyé.");
                setSuccess(true);
                reset();
            } else if (res.status === 409) {
                setMessage("Un utilisateur avec cet email existe déjà.");
            } else {
                setMessage("Une erreur est survenue lors de la création du conseiller.");
            }
        } catch (error: any) {
            console.error("Error creating advisor:", error);
            setMessage(error.response?.data?.error || "Erreur réseau. Vérifiez que le serveur est démarré.");
        }
    };

    return (
        <BankManagerOnly>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 px-4 py-8">
                {success ? (
                    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
                        <div className="bg-green-50 border-2 border-green-400 text-green-800 px-6 py-4 rounded-xl mb-6">
                            <p className="font-semibold">{message}</p>
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
                        className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-4">
                                <UserCheck className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Créer un conseiller bancaire
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <Input
                                label="Prénom"
                                icon={User}
                                variant="gradient"
                                placeholder="Marie"
                                error={errors.firstName?.message}
                                {...register("firstName")}
                            />

                            <Input
                                label="Nom"
                                icon={User}
                                variant="gradient"
                                placeholder="Martin"
                                error={errors.lastName?.message}
                                {...register("lastName")}
                            />

                            <Input
                                label="Email"
                                type="email"
                                icon={Mail}
                                variant="gradient"
                                placeholder="marie.martin@banque.fr"
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
                        </div>

                        <div className="mt-8">
                            <Button type="submit" variant="primary" fullWidth>
                                Créer le conseiller
                            </Button>
                        </div>

                {message && !success && <p className="mt-4 text-center text-sm text-red-600 break-words">{message}</p>}
            </form>
                )}
        </div>
        </BankManagerOnly >
    );
}
