"use client";

import { useRouter } from "next/navigation";
import { use, useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import ChatBox from "@/components/chat/chatBox";

interface ChatPageProps {
  params: Promise<{ conversationId: string }>;
}
export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const { isAuthenticated , user} = useContext(AuthContext);
  const unwrappedParams = use(params);
  const rawId = Number(unwrappedParams.conversationId);
  const conversationId = !isNaN(rawId) ? rawId : null;
  
  

  console.log("🔹é ChatPage rendered, isAuthenticated =", isAuthenticated);
  useEffect(() => {
    console.log("🔹 useEffect triggered, isAuthenticated =", isAuthenticated);
    // Redirection uniquement si authentifié = false
    if (isAuthenticated === false) {
      console.log("🔹 Redirection vers /login");
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Loader tant que l'authentification est indéfinie
  if (isAuthenticated === undefined) {
    console.log("🔹 Affichage du loader car isAuthenticated undefined");
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 animate-pulse">Vérification de l’authentification...</p>
      </div>
    );
  }
  if (!user) return <p>Chargement de l’utilisateur...</p>;

  // Affiche ChatBox seulement si authentifié
  if (isAuthenticated === true) {
    console.log("🔹 Affichage du ChatBox car isAuthenticated true");
    return (
      <main className="p-4">
        <ChatBox conversationId={conversationId} user={user} />
      </main>
    );
  }

  // isAuthenticated === false est géré par useEffect
  console.log("🔹 isAuthenticated false, rendu null temporaire");
  return null;
}
