"use client";

import { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import { useChat } from "@/lib/hooks/useChat";
import { MessageSend } from "@/types/messageSend";
import { Token } from "@/types/token";

interface ChatBoxProps {
  conversationId: number | null;
  user: Token;
}

export default function ChatBox({ conversationId, user }: ChatBoxProps) {
  const { messages, send, error, isConnected } = useChat(conversationId, user);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !conversationId || !user?.userId || !isConnected) return;

    const message: MessageSend = {
      userId: user.userId,
      conversationId,
      content,
      role: user.role,
    };

    send(message);
    setContent("");
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto border rounded-2xl shadow-md bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-gray-100 rounded-t-2xl">
        <h2 className="text-lg font-semibold text-gray-800">Chat en temps réel</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-600">{isConnected ? 'Connecté' : 'Déconnecté'}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Aucun message pour le moment</p>
          </div>
        ) : (
          messages.map(msg => {
            const role = Array.isArray(msg.role) ? msg.role[0] : msg.role;

            // true si c’est ton message
            const isMine = msg.userId === user.userId;

            // true si c’est un message du conseiller côté client
            const isAdvisorMessage = role === "BANK_ADVISOR" && user.role !== "BANK_ADVISOR";

            // true si c’est un message du client côté conseiller
            const isClientMessage = role === "CLIENT" && user.role === "BANK_ADVISOR";

            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-xl max-w-[75%] ${
                    isMine
                      ? 'bg-blue-500 text-white'           // tes messages à droite
                      : isAdvisorMessage
                      ? 'bg-green-200 text-gray-800'       // conseiller vu côté client
                      : isClientMessage
                      ? 'bg-gray-200 text-gray-800'        // client vu côté conseiller
                      : 'bg-gray-300 text-gray-800'        // fallback
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                  <p className="text-xs mt-1 text-gray-500">
                    {msg.sentAt
                      ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-gray-50 rounded-b-2xl flex gap-2">
        <input
          type="text"
          placeholder={isConnected ? "Écris ton message..." : "Connexion en cours..."}
          value={content}
          onChange={e => setContent(e.target.value)}
          className="flex-1 py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={!isConnected}
        />
        <Button type="submit" disabled={!content.trim() || !isConnected}>
          Envoyer
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="p-3 text-center text-sm text-red-600 border-t bg-red-50">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
