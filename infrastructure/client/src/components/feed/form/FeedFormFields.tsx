// components/feed/form/FeedFormFields.tsx
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateNewsModel } from "@/lib/validation/news/createNewsSchema";
import { NewsCategoryEnum, NewsPriorityEnum } from "@/types/news";
import { UploadedFile } from "@/types/uploadedFile";
import { Select } from "@/components/ui/Select";
import { MediaUploader } from "@/components/media/MediaUploader";
import Button from "@/components/ui/Button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseTags } from "@/lib/utils/tagsUtils";

interface FeedFormFieldsProps {
  register: UseFormRegister<CreateNewsModel>;
  control: Control<CreateNewsModel>;
  errors: FieldErrors<CreateNewsModel>;
  existingMedia?: UploadedFile[];
  disabled?: boolean;
  isSubmitting: boolean;
  isEditMode: boolean;
}


export function FeedFormFields({register,control,errors,existingMedia,disabled,isSubmitting,isEditMode}: FeedFormFieldsProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre *
        </label>
        <input
          {...register("title")}
          placeholder="Titre de l'actualité"
          className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.title ? "border-red-500" : "border-gray-300"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          disabled={disabled}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div>
              <Select
                label="Catégorie *"
                value={field.value || ""}
                onChange={field.onChange}
                options={Object.values(NewsCategoryEnum).map((c) => ({
                  label: c,
                  value: c,
                }))}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <div>
              <Select
                label="Priorité *"
                value={field.value || ""}
                onChange={field.onChange}
                options={Object.values(NewsPriorityEnum).map((p) => ({
                  label: p,
                  value: p,
                }))}
              />
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.priority.message}
                </p>
              )}
            </div>
          )}
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          {...register("tags", {
            setValueAs: (val) => parseTags(val),
          })}
          placeholder="Tags (séparés par des virgules, ex: épargne, taux, offre)"
          className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.tags ? "border-red-500" : "border-gray-300"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          disabled={disabled}
        />
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.tags.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Annuler
        </Button>

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : isEditMode ? (
            "Mettre à jour"
          ) : (
            "Créer l'actualité"
          )}
        </Button>
      </div>

    </div>
  );
}
