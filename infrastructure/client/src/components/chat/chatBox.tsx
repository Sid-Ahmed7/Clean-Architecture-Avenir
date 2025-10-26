"use client";

import { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import { useChat } from "@/lib/hooks/useChat";
import { MessageSend } from "@/types/MessageSend";
import { Token } from "@/types/Token";

interface ChatBoxProps {
  conversationId: number | null;
  user: Token;
}

export default function ChatBox({ conversationId, user }: ChatBoxProps) {
  const { messages, send, error, isConnected, markRead, typing, stopTyping, typingUsers } = useChat(conversationId, user);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const safeMessages = Array.isArray(messages) ? messages : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContent(value);

    if(!conversationId) {
      return;
    }

  if (conversationId != null && value.trim()) {
  typing(conversationId);
} else if (conversationId != null) {
  stopTyping(conversationId);
}
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if(!conversationId || !user) {
      return;
    }

    const unreadIds = safeMessages.filter((msg) => msg.authorId !== user.userId && msg.readStatus !== "READ").map((msg) => msg.id);
    if(unreadIds.length > 0) {
      markRead(unreadIds);
    }
  }, [safeMessages, conversationId, user, markRead]);

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
    if(conversationId != null) {
      stopTyping(conversationId);
    }
  };
return (
  <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto border rounded-2xl shadow-md bg-white">

    <div className="p-4 border-b bg-gray-100 rounded-t-2xl">
      <h2 className="text-lg font-semibold text-gray-800">Chat en temps réel</h2>
      <div className="flex items-center gap-2 mt-1">
        <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
        <span className="text-xs text-gray-600">{isConnected ? "Connecté" : "Déconnecté"}</span>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {safeMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>Aucun message pour le moment</p>
        </div>
      ) : (
        <>
          {safeMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.authorId === user.userId ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-[75%] ${msg.authorId === user.userId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                <p className="text-sm">{msg.content}</p>
                <span className="block text-[10px] text-gray-500 mt-1 text-right">
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {msg.readStatus === "READ" && msg.authorId === user.userId && " ✅"}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>

    {conversationId && typingUsers[conversationId] && typingUsers[conversationId].length > 0 && (
      <div className="px-4 py-1 text-xs text-gray-500">
        <span>en train d’écrire...</span>
      </div>
    )}

    <form onSubmit={handleSend} className="p-4 border-t bg-gray-50 rounded-b-2xl flex gap-2">
      <input
        type="text"
        placeholder={isConnected ? "Écris ton message..." : "Connexion en cours..."}
        value={content}
        onChange={handleInputChange}
        className="flex-1 py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        disabled={!isConnected}
      />
      <Button type="submit" disabled={!content.trim() || !isConnected}>Envoyer</Button>
    </form>

    {error && (
      <div className="p-3 text-center text-sm text-red-600 border-t bg-red-50">
        {error}
      </div>
    )}
  </div>
);
}