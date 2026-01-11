"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import {connectSocket,disconnectSocket,identifyUser,onPendingConversation,onConversationAssigned,onRemovePendingConversation} from "@/services/chatService";
import { AuthContext } from "@/contexts/AuthProvider";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { getAllPendingConversations, getAdvisorConversation, transferConversation } from "@/lib/api/chat";
import { ArrowRight, LayoutGrid, List, Search, Send, CheckCircle, Users, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import SelectAdvisorsModal from "./SelectAdvisorsModal";
import { getTimeAgo } from "@/lib/utils/chatUtils";
import { UserChat } from "@/types/chat/userChat";
import { useTranslations } from "next-intl";
import { useNotification } from "@/hooks/useNotifications";
import { NotificationEnum } from "@/types/Notification";

export default function AdvisorConversationsDashboard() {
  const t = useTranslations("components.chat.advisorConversations");
  const tModal = useTranslations("components.chat.selectAdvisorsModal");
  const tErrors = useTranslations("generalErrors.conversationsList");
  const { addNotification } = useNotification();
  const { user } = useContext(AuthContext);
  const { locale } = useContext(LocaleContext);
  const router = useRouter();

  const [pendingConversations, setPendingConversations] = useState<UserChat[]>([]);
  const [assignedConversations, setAssignedConversations] = useState<UserChat[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const handleTakeOver = useCallback((id: string) => router.push(`/${locale}/chat/${id}`), [router, locale]);
  const openTransferModal = useCallback((id: string) => { setSelectedConversationId(id); setModalOpen(true); }, []);
  
  const handleTransfer = useCallback(async (id: string, newAdvisorId: string) => {
    try {
      await transferConversation(id, newAdvisorId);
      setAssignedConversations(prev => prev.filter(c => c.id !== id));
      addNotification(NotificationEnum.INFO, tModal("transferSuccess"));
    } catch {
      addNotification(NotificationEnum.ALERT, tModal("transferError"));
    } finally {
      setModalOpen(false);
      setSelectedConversationId(null);
    }
  }, [tModal, addNotification]);

  useEffect(() => {
    if (!user?.userId) return;
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [pending, assigned] = await Promise.all([
          getAllPendingConversations(),
          getAdvisorConversation()
        ]);
        if (!isMounted) return;
        setPendingConversations(pending);
        setAssignedConversations(assigned);
        setError(null);
      } catch {
        if (isMounted) setError(tErrors("load"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const setupSocket = async () => {
      try {
        await connectSocket(user.role);
        await identifyUser(user.userId, user.role);
        setSocketConnected(true);

        onPendingConversation(conv => setPendingConversations(prev => prev.some(c => c.id === conv.id) ? prev : [...prev, conv]));
        onConversationAssigned(data => {
          setAssignedConversations(prev => prev.some(c => c.id === data.id) ? prev : [...prev, data]);
          setPendingConversations(prev => prev.filter(c => c.id !== data.id));
          
        
        });
        onRemovePendingConversation(({ conversationId }) => setPendingConversations(prev => prev.filter(c => c.id !== conversationId)));
      } catch {
        setSocketConnected(false);
      }
    };

    fetchData();
    setupSocket();

    return () => { isMounted = false; disconnectSocket("BANK_ADVISOR"); };
  }, [user?.userId]);

 

  const filteredAssigned = assignedConversations.filter(c => c.clientName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/50 z-50">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">{t("loading")}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/80 z-50">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t("errorTitle")}</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              {t("reloadPage")}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <p className="text-white/80 text-sm">{t("stats.pending")}</p>
          <p className="text-4xl font-bold">{pendingConversations.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
          <p className="text-white/80 text-sm">{t("stats.assigned")}</p>
          <p className="text-4xl font-bold">{assignedConversations.length}</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex-1 relative w-full lg:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder={t("searchPlaceholder")} value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode("cards")} className={`p-3 rounded-lg transition-all ${viewMode === "cards" ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}><LayoutGrid className="w-5 h-5" /></button>
            <button onClick={() => setViewMode("list")} className={`p-3 rounded-lg transition-all ${viewMode === "list" ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}><List className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{t("pendingTitle")}</h2>
        {pendingConversations.length === 0 ? (
          <div className="p-16 text-center bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">{search ? t("searchEmpty") : t("pendingEmpty")}</p>
          </div>
        ) : (
          <div className={`grid gap-5 ${viewMode === "cards" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {pendingConversations.map(conv => (
              <div key={conv.id} className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg text-gray-800">{conv.clientName}</p>
                      <p className="text-xs text-gray-500 mt-1">{getTimeAgo(conv.createdAt ?? "")}</p>
                    </div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleTakeOver(conv.id)} className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 px-4 hover:bg-blue-700 transition font-medium shadow-sm hover:shadow-md">{t("takeOver")}</button>
                    <button onClick={() => openTransferModal(conv.id)} className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition" aria-label={t("transfer")} title={t("transfer")}><ArrowRight className="w-5 h-5 text-gray-700" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{t("assignedTitle")}</h2>
        {filteredAssigned.length === 0 ? (
          <div className="p-16 bg-white/60 backdrop-blur-sm rounded-2xl text-center border border-slate-200">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">{search ? t("searchEmpty") : t("assignedEmpty")}</p>
          </div>
        ) : (
        <div
          className={`grid gap-5 ${
            viewMode === "cards"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
            {filteredAssigned.map(conv => (
              <div key={conv.id} className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg text-gray-800">{conv.clientName}</p>
                      <p className="text-xs text-gray-500 mt-1">{getTimeAgo(conv.createdAt ?? "")}</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleTakeOver(conv.id)} className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 px-4 hover:bg-blue-700 transition font-medium shadow-sm hover:shadow-md">{t("continue")}</button>
                    <button onClick={() => openTransferModal(conv.id)} className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition" aria-label={t("transfer")} title={t("transfer")}><Send className="w-5 h-5 text-gray-700" /></button>
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
          onTransfer={(advisorId, advisorName) => {
            if (selectedConversationId !== null) {
              handleTransfer(selectedConversationId, advisorId);
            }
          }}
          currentAdvisorId={user?.userId ?? ""}
        />

    </div>
  );
}
