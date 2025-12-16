"use client";

import { createAdmin } from "@/lib/api/auth";
import { CreateAdminInput, createAdminSchema } from "@/lib/validation/auth/createAdminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { User, Mail, Lock, CheckCircle, Shield } from "lucide-react";

export default function CreateAdminPage() {
    const router = useRouter();
    const { locale } = useContext(LocaleContext);
    const [message, setMessage] = useState("");
    const t = useTranslations();

    const { register, handleSubmit, formState: { errors } } = useForm<CreateAdminInput>({
        resolver: zodResolver(createAdminSchema(t))
    });

    const onSubmit = (data: CreateAdminInput) => {
        createAdmin(data).then((res) => {
            if (res.status === 201) {
                setMessage(t("messages.register.success"));
                router.push(`/${locale}/login`);
            } else if (res.status === 409) {
                setMessage(t("messages.register.userExists"));
            } else if (res.status === 403) {
                setMessage("Invalid admin creation password");
            } else {
                setMessage(t("messages.register.failure"));
            }
        }).catch((error) => {
            console.error("Error creating admin:", error);
            setMessage(`Network error: ${error.message}. Make sure the server is running on port 3000.`);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 px-4 py-8">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-4xl max-w border border-gray-100"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Create Admin
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">Administrator account creation</p>
                </div>

                <div className="gap-5 grid grid-cols-2">
                    <Input
                        label={t("labels.firstName")}
                        icon={User}
                        variant="gradient"
                        placeholder="John"
                        error={errors.firstName?.message}
                        {...register("firstName")}
                    />

                    <Input
                        label={t("labels.lastName")}
                        icon={User}
                        variant="gradient"
                        placeholder="Doe"
                        error={errors.lastName?.message}
                        {...register("lastName")}
                    />

                    <Input
                        label={t("labels.email")}
                        type="email"
                        icon={Mail}
                        variant="gradient"
                        placeholder="admin@example.com"
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

                    <Input
                        label={t("labels.confirmPassword")}
                        type="password"
                        icon={CheckCircle}
                        variant="gradient"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />

                    <div className="pt-2">
                        <Input
                            label="Admin Creation Password"
                            type="password"
                            icon={Shield}
                            variant="gradient"
                            placeholder="••••••••"
                            helperText="Special password required to create admin accounts"
                            error={errors.adminPassword?.message}
                            {...register("adminPassword")}
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <Button type="submit" variant="primary" fullWidth>
                        {t("labels.submit")}
                    </Button>
                </div>

                {message && <p className="mt-4 text-center text-sm text-gray-600 break-words">{message}</p>}
            </form>
        </div>
    );
}
