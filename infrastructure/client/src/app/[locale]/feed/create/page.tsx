"use client";

import { FeedForm } from "@/components/feed/form/FeedForm";



export default function CreateFeedPage() {

  return (
    <main className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Créer une nouvelle actualité</h1>
        <p className="text-gray-600 mt-2">Composez votre actualité avec l&apos;éditeur par blocs</p>
      </div>
      
      <FeedForm />
    </main>
  );
}
