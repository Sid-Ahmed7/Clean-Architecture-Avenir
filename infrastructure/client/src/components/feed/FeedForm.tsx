import { newsSchema } from "@/lib/validation/news/newsSchema";
import { News, NewsCategoryEnum, NewsPriorityEnum } from "@/types/news";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { Select } from "../ui/Select";
import Button from "../ui/Button";

interface FeedFormProps {
    initialValues?: Partial<News>;
    onSubmit: (data: News) => void;
}

export function FeedForm({initialValues, onSubmit} : FeedFormProps) {
        const t = useTranslations();

    const {register, handleSubmit, control, formState: {errors}} = useForm<News>({
        resolver: zodResolver(newsSchema(t)),
        defaultValues: initialValues
    });
     return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mb-4">
      <input {...register("title")} placeholder="Titre" className="border px-2 py-1 rounded" />
      {errors.title && <span className="text-red-500">{errors.title.message}</span>}

      <textarea {...register("content")} placeholder="Contenu" className="border px-2 py-1 rounded" />
      <input {...register("tags")} placeholder="Tags" className="border px-2 py-1 rounded" />
      <input {...register("images")} placeholder="URLs images (séparés par ,)" className="border px-2 py-1 rounded" />
      <input {...register("videos")} placeholder="URLs vidéos (séparés par ,)" className="border px-2 py-1 rounded" />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
            <Select
            label="Catégorie"
            value={field.value || ""}
            onChange={field.onChange}
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
            onChange={field.onChange}
            options={Object.values(NewsPriorityEnum).map(p => ({ label: p, value: p }))}
            />
        )}
      />

      <Button type="submit" variant="primary">Envoyer</Button>
    </form>
  );
};
