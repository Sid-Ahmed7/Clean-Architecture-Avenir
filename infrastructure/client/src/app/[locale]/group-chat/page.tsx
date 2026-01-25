"use client";

import { CreateGroupModal } from "@/components/group-chat/CreateGroupModal";
import { GroupList } from "@/components/group-chat/GroupList";
import { AuthContext } from "@/contexts/AuthProvider";
import { useGroupChatList } from "@/hooks/useGroupChatList";
import { useRouter } from "@/i18n/navigation";
import { GroupConversation } from "@/types/groupConversation";
import { RoleEnum } from "@/types/RoleEnum";
import { Loader2, Plus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useState } from "react";

export default function GroupChatPage() {
    const t = useTranslations("groupChat.page");
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const { groups, loading, error, creating, createGroup, joinAGroup, refetch } = useGroupChatList();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

    const isManager = user?.role === RoleEnum.BANK_MANAGER;

    const handleCreateGroup = async (groupName: string) => {
        await createGroup(groupName);
        setShowCreateModal(false);
    };

    const handleJoinGroup = async (groupId: string) => {
        setJoiningGroupId(groupId);
        await joinAGroup(groupId);
        setJoiningGroupId(null);
        router.push(`/group-chat/${groupId}`);
    };

    const handleOpenGroup = (group: GroupConversation) => {
        router.push(`/group-chat/${group.id}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2">{t("loading")}</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={refetch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {t("retry")}
                </button>
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {t("title")}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {groups.length > 1
                                ? t("groupCountPlural", { count: groups.length })
                                : t("groupCount", { count: groups.length })}
                        </p>
                    </div>
                    {isManager && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            {t("createGroup")}
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6">
                {groups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {t("noGroups")}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                            {isManager
                                ? t("noGroupsDescriptionManager")
                                : t("noGroupsDescriptionAdvisor")}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {groups.map((group) => (
                            <GroupList
                                key={group.id}
                                group={group}
                                onClick={() => handleOpenGroup(group)}
                                onJoin={() => handleJoinGroup(group.id)}
                                isJoining={joiningGroupId === group.id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateGroupModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateGroup}
                    isCreating={creating}
                />
            )}
        </div>
    );
}