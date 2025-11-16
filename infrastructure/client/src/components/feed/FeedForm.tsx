import {NewsCategoryEnum, NewsPriorityEnum } from "@/types/news";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { Select } from "../ui/Select";
import Button from "../ui/Button";
import { UploadedFile } from "@/types/uploadedFile";
import { useState, useEffect } from "react";
import { MediaUploader } from "../media/MediaUploader";
import { CreateNewsModel, createNewsSchema } from "@/lib/validation/news/createNewsSchema";
import { CreateNews } from "@/types/createNews";

interface FeedFormProps {
    initialValues?: CreateNews;
    existingMedia?: UploadedFile[];
    onSubmit: (data: CreateNews, files: File[]) => void;
}

export function FeedForm({ initialValues, existingMedia, onSubmit }: FeedFormProps) {
    const t = useTranslations();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<CreateNewsModel>({
        resolver: zodResolver(createNewsSchema(t)),
       defaultValues: initialValues || {
        title: "",
        content: "",
        category: NewsCategoryEnum.OFFER,
        priority: NewsPriorityEnum.LOW,
        tags: [],
        },
    });

    const watchedFields = watch();
    useEffect(() => {
        console.log("Form Fields Changed:", watchedFields);
    }, [watchedFields]);

    const handleFormSubmit = (data: CreateNewsModel) => {
        console.log("Form Submitted:", data);
        console.log("Selected Files on Submit:", selectedFiles);
        onSubmit(data, selectedFiles);
    }

    const handleFilesSelected = (files: File[]) => {
        console.log("Files Selected:", files);
        setSelectedFiles(files);
    }
    const parseTags = (value: string | string[] | undefined): string[] => {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)){
            return value;
        } 

        return value
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    };


    
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-2 mb-4">
            <input {...register("title")} placeholder="Titre" className="border px-2 py-1 rounded" />
            {errors.title && <span className="text-red-500">{errors.title.message}</span>}

            <textarea {...register("content")} placeholder="Contenu" className="border px-2 py-1 rounded" />
            {errors.content && <span className="text-red-500">{errors.content.message}</span>}

           <input
  {...register("tags", {
        setValueAs: (val) => parseTags(val)
  })}

  placeholder="Tags (séparés par des virgules)"
  className="border px-2 py-1 rounded"
/>
{errors.tags && <span className="text-red-500">{errors.tags.message}</span>}


            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter un Média
                </label>
                <MediaUploader
                    onFilesSelected={handleFilesSelected}
                    existingFiles={existingMedia}
                    maxSize={10}
                />
            </div>

            <Controller
                name="category"
                control={control}
                render={({ field }) => (
                    <Select
                        label="Catégorie"
                        value={field.value || ""}
                        onChange={(value) => {
                            console.log("Category Changed:", value);
                            field.onChange(value);
                        }}
                        options={Object.values(NewsCategoryEnum).map(c => ({ label: c, value: c }))}
                    />
                )}
            />

            <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                    <Select
                        label="Priorité"
                        value={field.value || ""}
                        onChange={(value) => {
                            console.log("Priority Changed:", value);
                            field.onChange(value);
                        }}
                        options={Object.values(NewsPriorityEnum).map(p => ({ label: p, value: p }))}
                    />
                )}
            />

            <Button type="submit" variant="primary">Envoyer</Button>
        </form>
    );
};
