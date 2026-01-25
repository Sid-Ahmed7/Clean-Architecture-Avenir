"use client";

import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface CreateGroupModalProps {
    onClose: () => void;
    onCreate: (name: string) => Promise<void>;
    isCreating: boolean;
}

export const CreateGroupModal = ({ onClose, onCreate, isCreating }: CreateGroupModalProps) => {
    const t = useTranslations("groupChat.createModal");

    const createGroupSchema = z.object({
        name: z.string().min(1, t("nameRequired")).min(3, t("nameMinLength")),
    });

    type CreateGroupFormData = z.infer<typeof createGroupSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateGroupFormData>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (data: CreateGroupFormData) => {
        await onCreate(data.name);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {t("title")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                    <div className="mb-4">
                        <label
                            htmlFor="groupName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            {t("nameLabel")}
                        </label>
                        <input
                            id="groupName"
                            type="text"
                            {...register("name")}
                            placeholder={t("namePlaceholder")}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                        />
                        {errors.name && (
                            <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            {t("cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                            {t("create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
