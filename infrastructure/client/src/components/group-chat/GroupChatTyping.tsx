import { Typing } from "@/types/typing";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

interface GroupChatTypingProps {
  data: Typing[];
}

export const GroupChatTyping = ({ data }: GroupChatTypingProps) => {
    const t = useTranslations("groupChat.typing");

    if (data.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            {data.length === 1 && (() => {
                const user = data[0];
                return (
                    <span className="flex items-center gap-1">
                        <span className="font-medium">{user.firstName}</span>
                        {user.isManager && <Sparkles className="w-3 h-3 text-amber-400" />}
                        <span>{t("isTyping")}</span>
                    </span>
                );
            })()}

            {data.length === 2 && (() => {
                const user1 = data[0];
                const user2 = data[1];
                return (
                    <span>
                        <span className="font-medium">{user1.firstName}</span> {t("and")}{" "}
                        <span className="font-medium">{user2.firstName}</span> {t("areTyping")}
                    </span>
                );
            })()}

            {data.length > 2 && (() => {
                const user1 = data[0];
                const othersCount = data.length - 1;
                return (
                    <span>
                        <span className="font-medium">{user1.firstName}</span> {t("and")}{" "}
                        <span className="font-medium">{t("others", { count: othersCount })}</span> {t("areTyping")}
                    </span>
                );
            })()}
        </div>
    );
};   