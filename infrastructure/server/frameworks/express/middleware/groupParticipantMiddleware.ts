import { Socket } from "socket.io";
import { groupParticipantRepository } from "../../../../adapters/config/repositories";

const EVENTS_REQUIRING_PARTICIPANT_CHECK = ["joinGroup", "sendMessage", "typing", "stopTyping"];

export const groupParticipantMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    socket.use(async ([event, ...args], eventNext) => {
        if (!EVENTS_REQUIRING_PARTICIPANT_CHECK.includes(event)) {
            return eventNext();
        }

        const user = socket.data.user;
        if (!user?.userId) {
            return eventNext(new Error("User not authenticated"));
        }

        const groupId = typeof args[0] === "string" ? args[0] : args[0]?.groupId;

        if (!groupId) {
            return eventNext(new Error("Group ID required"));
        }

        try {
            const isParticipant = await groupParticipantRepository.isParticipant(groupId, user.userId);

            if (!isParticipant) {
                return eventNext(new Error("Not a participant of this group"));
            }

            eventNext();
        } catch (error) {
            eventNext(new Error("Failed to verify group participation"));
        }
    });

    next();
};
