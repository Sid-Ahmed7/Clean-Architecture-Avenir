export class InvalidGroupParticipantError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidGroupParticipantError";
    }
}