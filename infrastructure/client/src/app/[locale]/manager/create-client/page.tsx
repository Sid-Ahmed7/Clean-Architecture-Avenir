"use client";

import { apiClient } from "@/lib/api/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { useTranslations } from "next-intl";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { User, Mail, Lock, Phone, Calendar, MapPin } from "lucide-react";
import { registerSchema } from "@/lib/validation/auth/registerSchema";
import { z } from "zod";

type CreateClientInput = z.infer<ReturnType<typeof registerSchema>>;

export default function CreateClientPage() {
    const router = useRouter();
    const { locale } = useContext(LocaleContext);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const t = useTranslations();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateClientInput>({
        resolver: zodResolver(registerSchema(t))
    });

    const onSubmit = async (data: CreateClientInput) => {
        try {
            const res = await apiClient.post("/auth/create-client", { ...data, locale });
            if (res.status === 201) {
                setMessage(t("auth.createClient.success"));
                setSuccess(true);
                reset();
            } else if (res.status === 409) {
                setMessage(t("auth.createClient.userExists"));
            } else {
                setMessage(t("auth.createClient.error"));
            }
        } catch (error: any) {
            if (error.response?.status === 409) {
                setMessage(t("auth.createClient.userExists"));
            } else {
                setMessage(error.response?.data?.error || t("auth.createClient.error"));
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
                        onClick={() => router.push(`/${locale}/manager/users`)}
                        variant="primary"
                        fullWidth
                    >
                        Retour à la gestion des utilisateurs
                    </Button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-100"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mb-4">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {t("auth.createClient.title")}
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            {t("auth.createClient.subtitle")}
                        </p>
                    </div>

                    <div className="gap-5 grid grid-cols-2">
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
                            label={t("auth.register.password")}
                            type="password"
                            icon={Lock}
                            variant="gradient"
                            placeholder="••••••••"
                            helperText={t("auth.register.passwordHelper")}
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <div className="col-span-2">
                            <TextArea
                                label={t("auth.register.address")}
                                rows={3}
                                variant="gradient"
                                placeholder={t("auth.register.placeholders.address")}
                                error={errors.address?.message}
                                {...register("address")}
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button type="submit" variant="primary" fullWidth>
                            {t("auth.createClient.submit")}
                        </Button>
                    </div>

                    {message && !success && <p className="mt-4 text-center text-sm text-red-600 break-words">{message}</p>}
                </form>
            )}
        </div>
    );
}
