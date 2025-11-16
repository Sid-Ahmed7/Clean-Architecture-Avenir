"use client";

import { FeedForm } from "@/components/feed/FeedForm";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { useNewsWithMedia } from "@/lib/hooks/useNewsWithMedia";
import { CreateNews, NewsCategoryEnum, NewsPriorityEnum } from "@/types/createNews";
import { useRouter } from "next/navigation";
import {  useContext } from "react";


export default function CreateFeedPage() {
      const { createNewsWithMedia} = useNewsWithMedia();

    const router = useRouter();
    const locale = useContext(LocaleContext);

     const handleCreate = async (data: CreateNews, files: File[]) => {
     const created = await createNewsWithMedia(data, files);
      if(created) {
         router.push(`/${locale}/feed/manage`); 
      }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Créer un nouveau feed</h1>
      <FeedForm
        initialValues={{
          title: "",
          content: "",
          category: NewsCategoryEnum.INVESTMENT,
          priority: NewsPriorityEnum.LOW,
          tags: []
        }}
        onSubmit={handleCreate}
      />
    </main>
  );
}
