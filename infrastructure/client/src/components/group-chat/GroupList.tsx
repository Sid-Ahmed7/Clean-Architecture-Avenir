"use client";

import { formatDate } from "@/lib/utils/date";
import { GroupConversation } from "@/types/groupConversation";
import { Loader2, MessageSquare, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface GroupListProps {
    group: GroupConversation;
    onClick: () => void;
    onJoin: () => void;
    isJoining: boolean;
    unreadCount?: number;
    lastMessage?: string;
    usersCount?: number;
}

export const GroupList = ({
    group,
    onClick,
    onJoin,
    isJoining,
    unreadCount = 0,
    lastMessage,
    usersCount = 0,
}: GroupListProps) => {
    const t = useTranslations("groupChat.groupCard");

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {group.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {usersCount > 1
                                ? t("participantPlural", { count: usersCount })
                                : t("participant", { count: usersCount })}
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </div>

            {lastMessage && (
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-3">
                    {lastMessage}
                </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{t("createdAt", { date: formatDate(group.createdAt) })}</span>
                {group.isParticipant ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        {t("open")}
                    </button>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onJoin();
                        }}
                        disabled={isJoining}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 transition-colors"
                    >
                        {isJoining ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Users className="w-4 h-4" />
                        )}
                        {t("join")}
                    </button>
                )}
            </div>
        </div>
    );
};
