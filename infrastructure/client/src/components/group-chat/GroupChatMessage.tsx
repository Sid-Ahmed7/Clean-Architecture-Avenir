import { GroupMessage } from "@/types/groupMessage";
import { formatTime } from "@/lib/utils/formatDate";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
interface GroupChatMessageProps {
    message: GroupMessage;
    isUserMessage : boolean;
}

export const GroupChatMessage = ({ message, isUserMessage }: GroupChatMessageProps) => {
    return (
        <div
            className={cn("flex flex-col mb-4 max-w-[70%]", isUserMessage ? "ml-auto items-end" : "mr-auto items-start")}
        >
            <div className="flex items-center gap-2 mb-1">
                <span
                    className={cn("text-sm font-medium",message.isManager ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-gray-400")}
                >
                    {message.senderFirstName} {message.senderLastName}
                </span>

                {message.isManager && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                        <Sparkles  className="w-3 h-3" />
                        Directeur
                    </span>
                )}
            </div>

            <div
                className={cn("rounded-2xl px-4 py-2 shadow-sm",isUserMessage ? "bg-blue-600 text-white rounded-br-md": message.isManager
                        ? "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-2 border-amber-300 dark:border-amber-600 text-gray-900 dark:text-gray-100 rounded-bl-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
                )}
            >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
            <span className="text-xs text-gray-400 mt-1">{formatTime(message.createdAt)}</span>
        </div>
    );
};