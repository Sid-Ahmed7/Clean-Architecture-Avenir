"use client";

import { useRouter } from "next/navigation";
import { use, useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import Chat from "@/components/chat/Chat";
interface ChatPageProps {
  params: Promise<{ conversationId: string }>;
}
export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const { isAuthenticated , user} = useContext(AuthContext);
  const unwrappedParams = use(params);
  const rawId = Number(unwrappedParams.conversationId);
  const conversationId = !isNaN(rawId) ? rawId : null;
  
  

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return (
      <div className="flex justify-center items-center h-screen p-4">
        {isAuthenticated === undefined ? (
          <p className="text-gray-700 animate-pulse">
            Vérification de l’authentification...
          </p>
        ) : !user ? (
          <p className="text-gray-700">Chargement de l’utilisateur...</p>
        ) : (
          <Chat conversationId={conversationId} user={user} />
        )}
      </div>
    );
  }