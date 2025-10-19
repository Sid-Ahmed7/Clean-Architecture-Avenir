"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import ChatBox from "@/components/chat/chatBox";

interface ChatPageProps {
  params: { clientId: string };
}

export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();

  const { clientId } = params;
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login"); 
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700">Chargement...</p>
      </div>
    );
  }

  return (
    <main className="p-4">
      <ChatBox clientId={clientId} />
    </main>
  );
}
