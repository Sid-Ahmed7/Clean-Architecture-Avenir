"use client";

import { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import { useChat } from "@/hooks/useChat";
import { Token } from "@/types/Token";

interface ChatBoxProps {
  conversationId: number | null;
  user: Token;
}

export default function Chat({ conversationId, user }: ChatBoxProps) {
  const {messages,connected,send,startTyping,stopTyping,markRead,typingUsers} = useChat(user.userId, user.role, conversationId!);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContent(value);

    if (!conversationId){
      return;
    }

    if (value.trim()){
      startTyping(conversationId);
    } else{
       stopTyping(conversationId);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (!conversationId){
      return;
    } 
    const unreadIds = messages
      .filter((m) => m.authorId !== user.userId && m.readStatus !== "READ")
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      markRead(unreadIds);
    }
  }, [messages, conversationId, user.userId, markRead]);


  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !conversationId || !user?.userId || !connected){
      return;
    } 
    send(content, conversationId);
    setContent("");
    stopTyping(conversationId);
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto border rounded-2xl shadow-md bg-white">

      <div className="p-4 border-b bg-gray-100 rounded-t-2xl">
        <h2 className="text-lg font-semibold text-gray-800">Chat</h2>

        <div className="flex items-center gap-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-xs text-gray-600">
            {connected ? "Connecté" : "Déconnecté"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Aucun message pour le moment</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.authorId === user.userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                    msg.authorId === user.userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>

                  <span className="block text-[10px] text-gray-500 mt-1 text-right">
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {msg.readStatus === "READ" && msg.authorId === user.userId && " ✅"}
                  </span>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {conversationId &&
        typingUsers.some((u) => u.conversationId === conversationId && u.userId !== user.userId) && (
          <div className="px-4 py-1 text-xs text-gray-500">
            <span>En train d’écrire...</span>
          </div>
      )}

      <form onSubmit={handleSend} className="p-4 border-t bg-gray-50 rounded-b-2xl flex gap-2">
        <input
          type="text"
          placeholder={connected ? "Écris ton message..." : "Connexion en cours..."}
          value={content}
          onChange={handleInputChange}
          className="flex-1 py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          disabled={!connected}
        />
        <Button type="submit" disabled={!content.trim() || !connected}>
          Envoyer
        </Button>
      </form>

    </div>
  );
}
