"use client";

import { FeedForm } from "@/components/feed/FeedForm";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { useNews } from "@/lib/hooks/useNews";
import { News } from "@/types/news";
import { useRouter } from "next/navigation";
import {  useContext } from "react";


export default function CreateFeedPage() {
    const {createNews} = useNews();
    const router = useRouter();
    const locale = useContext(LocaleContext);

     const handleCreate = async (data: Partial<News>) => {
    await createNews(data);
    router.push(`${locale}/feed/manage`); 
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Créer un nouveau feed</h1>
      <FeedForm initialValues={{}} onSubmit={handleCreate} />
    </main>
  );
}
