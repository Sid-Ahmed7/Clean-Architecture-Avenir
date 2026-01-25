"use client";

import { GroupChatRoom } from "@/components/group-chat/GroupChatRoom";
import { useParams } from "next/navigation";
import { GroupConversation } from '@/types/groupConversation';
import { useEffect, useState } from "react";
import { getAllGroups } from "@/lib/api/groupChat";
import { useTranslations } from "next-intl";

export default function GroupChatDetailPage() {
    const t = useTranslations("groupChat.room");
    const params = useParams();
    const groupId = params.groupId as string;
    const [group, setGroup] = useState<GroupConversation | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const groups = await getAllGroups();
                const foundGroup = groups.find(g => g.id === groupId);
                setGroup(foundGroup || null);
            } catch (error) {
                console.error("Erreur lors du chargement du groupe:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (groupId) {
            fetchGroup();
        }
    }, [groupId]);

    if (!groupId || (!isLoading && !group)) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{t("groupNotFound")}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>{t("loadingGroup")}</p>
            </div>
        );
    }

    return (
        <div className="h-full">
            <GroupChatRoom groupId={groupId} groupName={group?.name || groupId} />
        </div>
    );
}


