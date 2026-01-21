export class NotAGroupParticipantError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotAGroupParticipantError";
    }
}
