"use client";

import { useContext, useEffect, useState } from "react";
import { getAllPendingConversations, getAdvisorConversation, transferConversation } from "@/lib/api/chat";
import { connectSocket, disconnectSocket, identifyUser, onPendingConversation, onConversationAssigned, onRemovePendingConversation } from "@/services/chatService";
import { AuthContext } from "@/contexts/AuthProvider";
import { Conversation } from "@/types/Conversation";
import SelectAdvisorsModal from "./SelectAdvisorsModal";
import { ArrowRight, CheckCircle, Clock, MessageSquare, MoreVertical, Search, Users, UserCheck, LayoutGrid, List, Send } from "lucide-react";
import { getTimeAgo } from "@/lib/utils/chatUtils";
import { useRouter } from "next/navigation";
import { LocaleContext } from "@/contexts/LocaleProvider";

export default function AdvisorConversationsDashboard() {
  const { user } = useContext(AuthContext);
  const {locale} = useContext(LocaleContext);
  const router = useRouter();
  const [pendingConversations, setPendingConversations] = useState<Conversation[]>([]);
  const [assignedConversations, setAssignedConversations] = useState<Conversation[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState<string | null>(null);

   const handleTakeOver = (conversationId: number) => {
    router.push(`/${locale}/chat/${conversationId}`);
  };

  const openTransferModal = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setModalOpen(true);
  };

  const handleTransfer = async (conversationId: number, newAdvisorId: string) => {
    if (!newAdvisorId) return;
    try {
      await transferConversation(conversationId, newAdvisorId);
      setAssignedConversations(prev => prev.filter(c => c.id !== conversationId));
      alert("Conversation transférée avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors du transfert de la conversation");
    } finally {
      setModalOpen(false);
      setSelectedConversationId(null);
    }
  };

  useEffect(() => {
    if (!user?.userId) return;
    let isMounted = true;

    const fetchConversations = async () => {
      try {
        const [pending, assigned] = await Promise.all([
          getAllPendingConversations(),
          getAdvisorConversation(),
        ]);

        if (!isMounted) return;

        setPendingConversations(prev =>
          [...prev, ...pending.filter(p => !prev.some(pc => pc.id === p.id))]
        );
        setAssignedConversations(prev =>
          [...prev, ...assigned.filter(a => !prev.some(ac => ac.id === a.id))]
        );
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const setupSocket = async () => {
      try {
        await connectSocket();
        await identifyUser(user.userId, "BANK_ADVISOR");

        onPendingConversation((pc) => {
          const conv: Conversation = {
            id: pc.id,
            clientId: pc.clientId,
            advisorId: pc.advisorId ?? "",
            createdAt: pc.createdAt ?? new Date().toISOString(),
          };

          setPendingConversations(prev => {
            if (conv.advisorId) return prev.filter(c => c.id !== conv.id);
            if (prev.some(c => c.id === conv.id)) return prev;
            return [...prev, conv];
          });
        });

        onConversationAssigned((data) => {
          setAssignedConversations(prev => {
            if (prev.some(c => c.id === data.conversationId)) return prev;
            return [
              ...prev,
              {
                id: data.conversationId,
                clientId: user.userId,
                advisorId: data.advisorId,
                createdAt: new Date().toISOString(),
              },
            ];
          });

          setPendingConversations(prev =>
            prev.filter(c => c.id !== data.conversationId)
          );
        });

        onRemovePendingConversation((data) => {
          setPendingConversations(prev =>
            prev.filter(c => c.id !== data.conversationId)
          );
        });

      } catch (err) {
        console.error("Socket error:", err);
        setSocketError(err instanceof Error ? err.message : "Erreur de socket");
      }
    };

    fetchConversations();
    setupSocket();

    return () => {
      isMounted = false;
      disconnectSocket();
    };
  }, [user]);

  const filteredPending = pendingConversations.filter((conv) => {
      if (!search.trim()) return true;
      const clientName = conv.clientName || "";
      return clientName.toLowerCase().includes(search.toLowerCase());
    });

  const filteredAssigned = assignedConversations.filter(conv => {
      if (!search.trim()) return true;
      const clientName = conv.clientName || "";
      return clientName.toLowerCase().includes(search.toLowerCase());
    });


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-white/80 text-sm font-medium mb-1">En attente</p>
          <p className="text-4xl font-bold mb-1">{pendingConversations.length}</p>
          <p className="text-white/70 text-xs">Demandes non assignées</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <p className="text-white/80 text-sm font-medium mb-1">Mes conversations</p>
          <p className="text-4xl font-bold mb-1">{assignedConversations.length}</p>
          <p className="text-white/70 text-xs">Clients actifs</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex-1 relative w-full lg:max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("cards")}
            className={`p-2 rounded-lg ${viewMode==="cards"?"bg-white text-blue-600 shadow-sm":"text-slate-600"}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${viewMode==="list"?"bg-white text-blue-600 shadow-sm":"text-slate-600"}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Demandes en attente</h2>
        {filteredPending.length === 0 ? (
          <div className="bg-white/60 backdrop-blur rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <p className="text-slate-900 font-bold text-xl mb-2">Aucune demande en attente</p>
            <p className="text-slate-500">Toutes les demandes ont été traitées</p>
          </div>
        ) : (
          <div className={`grid gap-5 ${viewMode==="cards"?"grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4":"grid-cols-1"}`}>
            {filteredPending.map(conv => (
              <div key={conv.id} className="group bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition-all overflow-hidden hover:shadow-2xl hover:-translate-y-1">
                <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-full">URGENT</span>
                    <button onClick={() => openTransferModal(conv.id)} className="p-2 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {conv.clientName ? conv.clientName.slice(0,2).toUpperCase() : "Aucun client"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900">{conv.clientName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {getTimeAgo(conv.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleTakeOver(conv.id)} className="flex-1 bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-500 transition-colors">Prendre en charge</button>
                    <button onClick={() => openTransferModal(conv.id)} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto p-6 mt-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Vos conversations</h2>
        {filteredAssigned.length === 0 ? (
          <div className="bg-white/60 backdrop-blur rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-900 font-bold text-xl mb-2">Aucune conversation assignée</p>
            <p className="text-slate-500">Les conversations que vous gérez apparaîtront ici</p>
          </div>
        ) : (
          <div className={`grid gap-5 ${viewMode==="cards"?"grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4":"grid-cols-1"}`}>
            {filteredAssigned.map(conv => (
              <div key={conv.id} className="group bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all overflow-hidden hover:shadow-2xl hover:-translate-y-1">
                <div className="h-1.5 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">Active</span>
                    <button onClick={() => openTransferModal(conv.id)} className="p-2 hover:bg-slate-100 rounded-lg">
                      <Send className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {conv.clientName ? conv.clientName.slice(0,2).toUpperCase() : "Aucun client"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900">{conv.clientName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {getTimeAgo(conv.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleTakeOver(conv.id)} className="flex-1 bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-500 transition-colors">Continuer</button>
                    <button onClick={() => openTransferModal(conv.id)} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SelectAdvisorsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onTransfer={(advisorId) => selectedConversationId !== null && handleTransfer(selectedConversationId, advisorId)}
        currentAdvisorId={user?.userId ?? ""}
      />
    </div>
  );
}
