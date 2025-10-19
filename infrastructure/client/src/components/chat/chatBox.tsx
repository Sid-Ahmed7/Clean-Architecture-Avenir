"use client";

import { useChat } from "@/lib/hooks/useChat";
import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
interface ChatBoxProps {
    clientId: string;
}

export default function ChatBox({clientId}: ChatBoxProps) {
    const {messages, send, error} = useChat(clientId);
    const [content, setContent] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if(content.trim()) {
            send(content);
            setContent("");
        }
        
    };


     return (
        

    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto border rounded-2xl shadow-md bg-white">
      <div className="p-4 border-b bg-gray-100 rounded-t-2xl">
        <h2 className="text-lg font-semibold text-gray-800">Chat en temps réel</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl max-w-[75%] ${
              msg.authorId === clientId
                ? "bg-blue-100 self-end ml-auto"
                : "bg-gray-200 self-start mr-auto"
            }`}
          >
            <p className="text-sm text-gray-800">{msg.content}</p>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {new Date(msg.sentAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t bg-gray-50 rounded-b-2xl flex gap-2">
        <input
          type="text"
          placeholder="Écris ton message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" disabled={!content.trim()}>
          Envoyer
        </Button>
      </form>

      {error && (
        <div className="p-2 text-center text-sm text-red-500 border-t bg-red-50">{error}</div>
      )}
    </div>
  );
}