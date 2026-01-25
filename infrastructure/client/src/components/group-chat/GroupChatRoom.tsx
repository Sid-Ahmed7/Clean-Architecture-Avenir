import { AuthContext } from "@/contexts/AuthProvider";
import { useGroupChat } from "@/hooks/useGroupChat";
import { RoleEnum } from "@/types/RoleEnum";
import { useContext, useEffect, useRef, useState } from "react";
import { GroupChatMessage } from './GroupChatMessage';
import { Users, Send } from 'lucide-react';
import { GroupChatTypingIndicator } from './GroupChatTypingIndicator';
import { GroupChatParticipantsList } from './GroupChatParticipantsList';

interface GroupChatRoomProps {
    groupId: string;
    groupName: string;
}


export const GroupChatRoom = ({ groupId, groupName }: GroupChatRoomProps) => {

    const { user } = useContext(AuthContext);
    const [inputValue, setInputValue] = useState("");
    const [showUsersList, setShowUsersList] = useState(true);
    const messagesEndref = useRef<HTMLDivElement>(null);
    const {messages,participants,typingUsers,onlineUsers,connected,isLoading,error,sendMessage,startTyping,stopTyping} = useGroupChat(groupId,user?.userId || "",(user?.role as RoleEnum) || RoleEnum.BANK_ADVISOR);

    const currentParticipant = participants?.find(p => p.userId === user?.userId);

    useEffect(() => {
        messagesEndref.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if(!inputValue.trim()) {
            return;
        }
        sendMessage(inputValue.trim());
        setInputValue("");
        stopTyping();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        if(e.target.value) {
            startTyping({
                userId: user?.userId || "",
                firstName: currentParticipant?.firstName || "",
                lastName: currentParticipant?.lastName || "",
                isManager: user?.role === RoleEnum.BANK_MANAGER,
            });
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                Chargement du chat de groupe...
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                {error}
            </div>
        );
    }
    return (
        <div className="flex h-full bg-white dark:bg-gray-900">
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {groupName}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {participants.length} participants • {onlineUsers.length} en ligne
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                                connected
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            )}
                        >
                            <span
                                className={cn(
                                    "w-2 h-2 rounded-full",
                                    connected ? "bg-green-500" : "bg-red-500"
                                )}
                            />
                            {connected ? "Connecté" : "Déconnecté"}
                        </span>
                        <button
                            onClick={() => setShowUsersList(!showUsersList)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            <Users className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Aucun message. Commencez la conversation !
                        </div>
                    ) : (
                        messages.map((message) => (
                            <GroupChatMessage
                                key={message.id}
                                message={message}
                                isOwnMessage={message.senderId === user?.userId}
                            />
                        ))
                    )}
                    <div ref={messagesEndref} />
                </div>

                <GroupChatTypingIndicator
                    typingUsers={typingUsers.filter(u => u.userId !== user?.userId)}
                />

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-end gap-3">
                        <textarea
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Écrivez votre message..."
                            rows={1}
                            className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || !connected}
                            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {showUsersList && (
                <GroupChatParticipantsList
                    participants={participants}
                    onlineUsers={onlineUsers}
                />
            )}
        </div>
    );
};