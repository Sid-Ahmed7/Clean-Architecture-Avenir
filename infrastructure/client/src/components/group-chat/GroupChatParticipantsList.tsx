import { cn } from "@/lib/utils";
import { GroupParticipant } from "@/types/groupParticipant";
import { RoleEnum } from "@/types/RoleEnum";
import { Circle, Crown } from "lucide-react";

interface GroupChatParticipantsListProps {
    participants: GroupParticipant[];
    onlineUsers: string[];
}

export const GroupChatParticipantsList = ({ participants, onlineUsers }: GroupChatParticipantsListProps) => {

    const sortedUsers = [...participants].sort((a, b) => {
        if(a.role === RoleEnum.BANK_MANAGER && b.role !== RoleEnum.BANK_MANAGER) {
            return -1;
        }
        if(a.role !== RoleEnum.BANK_MANAGER && b.role === RoleEnum.BANK_MANAGER) {
            return 1;
        }

        return (a.firstName || "").localeCompare(b.firstName || "");
    });

return (
    <div className="w-64 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Participants ({participants.length})
            </h3>

            <ul className="space-y-2">
                {sortedUsers.map((user) => {
                    const isOnline = onlineUsers.includes(user.userId);
                    const isManager = user.role === RoleEnum.BANK_MANAGER;

                    return (
                        <li key={user.id} className={cn("flex items-center gap-3 p-2 rounded-lg", isManager && "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800")}>
                        
                            <div className="relative">
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-medium",isManager
                                            ? "bg-gradient-to-br from-amber-400 to-amber-600"
                                            : "bg-gradient-to-br from-blue-400 to-blue-600"
                                    )}
                                >
                                    {user.firstName?.[0]}
                                    {user.lastName?.[0]}
                                </div>
                                <Circle
                                    className={cn("absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5", isOnline ? "text-green-500 fill-green-500" : "text-gray-400 fill-gray-400")}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    {isManager && (
                                        <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {isManager ? "Directeur" : "Conseiller"}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
    </div>
);
};