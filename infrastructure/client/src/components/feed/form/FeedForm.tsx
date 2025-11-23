'use client';

import { NewsCategoryEnum, NewsPriorityEnum } from "@/types/news";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { CreateNewsModel, createNewsSchema } from "@/lib/validation/news/createNewsSchema";
import { useRouter } from "next/navigation";
import { AlertCircle, X } from "lucide-react";
import { useNewsMutation } from "@/hooks/useNews";
import { useMediaMutations } from "@/hooks/useMedia";
import { useContentMutations } from "@/hooks/useContent";
import { FeedFormFields } from "./FeedFormFields";
import { BlockEditor } from "../blocks/BlockEditor";
import { TypeBlock, Block } from "@/types/contentBlock";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { useQueryClient } from "@tanstack/react-query";

interface FeedFormProps {
  newsId?: number;
  initialValues?: CreateNewsModel;
  initialBlocks?: Block[];
}

export function FeedForm({ newsId, initialValues, initialBlocks }: FeedFormProps) {
  const t = useTranslations();
  const { locale } = useContext(LocaleContext);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createNews, updateNews } = useNewsMutation();
  const { uploadMedia } = useMediaMutations();
  const { createContent, updateContent } = useContentMutations();

  const isEditMode = !!newsId;

  const { register, handleSubmit, control, setError, clearErrors, formState: { errors }, reset } = useForm<CreateNewsModel>({
    resolver: zodResolver(createNewsSchema(t)),
    defaultValues: initialValues || {
      title: "",
      category: NewsCategoryEnum.OFFER,
      priority: NewsPriorityEnum.LOW,
      tags: [],
    },
  });

  const handleFormSubmit = async (data: CreateNewsModel) => {
       
    clearErrors();

    if (blocks.length === 0) {
      setError("root.blocksError", {
        type: "manual",
        message: "Ajoutez au moins un bloc de contenu",
      });
      return;
    }

    const textBlocks = blocks.filter((b) => b.type === TypeBlock.TEXT);
    const hasEmptyText = textBlocks.some((b) => !b.content || !b.content.trim());
    
    if (hasEmptyText) {
      setError("root.blocksError", {
        type: "manual",
        message: "Tous les blocs de texte doivent contenir du contenu",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let newsResult;
      let targetNewsId: number;

      if (isEditMode && newsId) {
        
        newsResult = await updateNews.mutateAsync({
          id: newsId,
          title: data.title,
          category: data.category,
          priority: data.priority,
          tags: data.tags || [],
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        if (newsResult.error || !newsResult.data) {
          console.error("❌ Erreur update news:", newsResult.error);
          setError("root.serverError", {
            type: "manual",
            message: newsResult.error || "Erreur lors de la mise à jour",
          });
          return;
        }
        
        targetNewsId = newsId;
        
      } else {
        
        newsResult = await createNews.mutateAsync({
          title: data.title,
          category: data.category,
          priority: data.priority,
          tags: data.tags || [],
        });

        if (newsResult.error || !newsResult.data) {
          setError("root.serverError", {
            type: "manual",
            message: newsResult.error || "Erreur lors de la création",
          });
          return;
        }

        targetNewsId = newsResult.data.id;
      }

      for (const block of blocks) {
        if (block.type === TypeBlock.TEXT) {
          
          if (block.id > 0 && isEditMode) {
            
            const updatedContent = await updateContent.mutateAsync({
              id: block.id,
              newsId: targetNewsId,
              content: block.content,
              order: block.order
            });
            
            if (updatedContent.error) {
            } else {
            }
          } else {
            console.log(`   Données:`, {
              newsId: targetNewsId,
              content: block.content.substring(0, 50) + "...",
              order: block.order
            });
            
            const contentResult = await createContent.mutateAsync({
              newsId: targetNewsId,
              content: block.content,
              order: block.order
            });
            
            if (contentResult.error) {
              setError("root.serverError", {
                type: "manual",
                message: `Erreur bloc texte ${block.order + 1}: ${contentResult.error}`,
              });
              return;
            } 
          }
        }

        if (block.type === TypeBlock.MEDIA) {
          
          if (block.files && block.files.length > 0) {
            const mode = isEditMode ? "nouveaux" : "tous les";
            
            for (const file of block.files) {
              console.log(`   📤 Upload: ${file.name}`);
              
              const mediaResult = await uploadMedia.mutateAsync({
                file,
                newsId: targetNewsId,
                altText: `${data.title} - Media`,
              });

              if (mediaResult.error) {
              } 
            }
          }

          if (isEditMode && block.existingMedias && block.existingMedias.length > 0) {
            console.log(`   ℹ️ ${block.existingMedias.length} médias existants conservés`);
          }
        }
      }
      
      await queryClient.invalidateQueries({ queryKey: ["news", targetNewsId] });
      await queryClient.invalidateQueries({ queryKey: ["content", "news", targetNewsId] });
      await queryClient.invalidateQueries({ queryKey: ["media", "news", targetNewsId] });
      
      router.refresh();
      
      router.push(`/${locale}/feed/${targetNewsId}`);
      
    } catch (error: any) {
      console.error("Erreur:", error);
      setError("root.serverError", {
        type: "manual",
        message: error.message || "Une erreur est survenue",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  useEffect(() => {
    if (initialBlocks && initialBlocks.length > 0) {
      setBlocks(initialBlocks);
    }
  }, [initialBlocks]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-5xl mx-auto">
      {errors.root?.serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <p className="text-sm text-red-700 mt-1">{errors.root.serverError.message}</p>
          </div>
          <button
            type="button"
            onClick={() => clearErrors("root.serverError")}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errors.root?.blocksError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-yellow-700">{errors.root.blocksError.message}</p>
          </div>
          <button
            type="button"
            onClick={() => clearErrors("root.blocksError")}
            className="text-yellow-400 hover:text-yellow-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Informations générales</h2>
        <FeedFormFields
          register={register}
          control={control}
          errors={errors}
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}      
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Contenu de l&apos;actualité</h2>
        <BlockEditor 
          onChange={setBlocks} 
          initialBlocks={initialBlocks}
          disabled={isSubmitting} 
        />
      </div>
    </form>
  );
}
