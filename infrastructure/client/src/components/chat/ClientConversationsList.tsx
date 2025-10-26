"use client";

import { Conversation } from "@/types/conversation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getClientConversation, createConversation } from "@/lib/api/chat";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ChevronRight, Clock, MessageCircle, Plus } from "lucide-react";

export default function ClientConversationList() {
  const router = useRouter();
  const locale = useLocale()
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchConversations = async () => {
    try {
      const clientConversations = await getClientConversation();
      setConversations(clientConversations);
    } catch (err) {
        setError("Impossible de récupérer vos conversations");
    }
  };

  const handleCreateConversation = async () => {
    setLoading(true);
    try {
      const newConversation = await createConversation();
      setConversations((prev) => [...prev, newConversation]);
      router.replace(`/${locale}/chat/${newConversation.id}`);
    } catch (err) {
      setError("Erreur lors de la création de la conversation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Mes conversations</h2>
          <button
            onClick={handleCreateConversation}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Plus size={20} />
            {loading ? "Création..." : "Nouvelle conversation"}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {conversations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <MessageCircle className="mx-auto text-slate-300 mb-4" size={64} />
            <p className="text-slate-600 text-lg">Vous n'avez pas encore de conversation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all duration-200 flex items-center justify-between border border-slate-100 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    {conv.clientName?.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-lg">{conv.clientName || conv.clientId}</h3>
                    {conv.subject && (
                      <p className="text-blue-600 font-medium text-sm mt-1">{conv.subject}</p>
                    )}
                    <p className="text-slate-600 text-sm mt-1 line-clamp-1">{conv.lastMessage}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <Clock size={14} />
                    {conv.lastMessageDate ? formatDate(conv.lastMessageDate) : ""}
                  </div>
                  <ChevronRight className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}