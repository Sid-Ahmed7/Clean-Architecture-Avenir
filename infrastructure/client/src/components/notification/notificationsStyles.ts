import { AlertTriangle, CheckCircle, Icon, icons, Info, MessageSquare, Settings } from "lucide-react";

export const notificationStyles = {
    INFO: {
        icon: Info,
        color: "text-blue-600 bg-blue-50 border-blue-200" 
    },
    ALERT: {
        icon: AlertTriangle,
        color: "text-red-600 bg-red-50 border-red-200"
    },
    ACTION: {
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 border-green-200"
    },
    MESSAGING: {
        icon: MessageSquare,
        color: "text-purple-600 bg-purple-50 border-purple-200"
    },
    SYSTEM: {
        icon: Settings,
        color: "text-gray-700 bg-gray-50 border-gray-200"
    }

}