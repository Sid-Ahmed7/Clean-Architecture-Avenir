"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { Token } from "@/types/Token";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import Button from "../ui/Button";

interface ChatBoxProps {
  conversationId: string | null;
  user: Token;
}

export default function Chat({ conversationId, user }: ChatBoxProps) {
  const t = useTranslations("components.chat");
  const { messages, connected, send, startTyping, stopTyping, markRead, typingUsers } = useChat(user.userId, user.role, conversationId!);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContent(value);

    if (!conversationId){
      return;
    }

    if (value.trim()) {
      startTyping(conversationId);
    } else {
      stopTyping(conversationId);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (!conversationId) {
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

    if (!content.trim() || !conversationId || !user?.userId || !connected) {
      return;
    }
    send(content, conversationId);
    setContent("");
    stopTyping(conversationId);
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-lg">
            BA
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t("title")}</h2>
            <div className="flex items-center gap-2 text-xs opacity-90">
              <span className={`h-2 w-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></span>
              {connected ? t("connected") : t("disconnected")}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-300">
          🔒
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-slate-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>{t("noMessages")}</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.authorId === user.userId ? "justify-end" : "justify-start"} gap-3`}
              >
                <div className={`flex flex-col gap-1 max-w-[70%] ${msg.authorId === user.userId ? "items-end" : ""}`}>
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-md ${
                      msg.authorId === user.userId
                        ? "bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-tr-sm"
                        : "bg-white text-slate-800 rounded-tl-sm border border-slate-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] text-slate-400 px-2 ${msg.authorId === user.userId ? "justify-end" : ""}`}>
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {msg.readStatus === "READ" && msg.authorId === user.userId && (
                      <span className="text-blue-500">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </>
        )}
      </main>

      {conversationId &&
        typingUsers.some((u) => u.conversationId === conversationId && u.userId !== user.userId) && (
          <div className="px-6 py-2 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
              {t("typing")}
            </div>
          </div>
        )}

      <form className="flex items-center gap-3 px-6 py-4 bg-white border-t border-slate-200" onSubmit={handleSend}>
        <button
          type="button"
          className="text-slate-400 hover:text-slate-600 transition"
        >

        </button>
        <input
          type="text"
          placeholder={connected ? t("inputPlaceholder") : t("inputDisabled")}
          value={content}
          onChange={handleInputChange}
          className="flex-1 px-5 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm bg-slate-50 text-slate-900"
          disabled={!connected}
        />
        <Button
          type="submit"
          disabled={!content.trim() || !connected}
          icon={Send}
          iconPosition="right"
          className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900"
        >
          {t("sendButton")}
        </Button>
      </form>
    </div>
  );
}
