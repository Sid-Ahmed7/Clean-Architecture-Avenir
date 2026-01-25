import { InvalidGroupParticipantError } from "../errors/InvalidGroupParticipantError";

export class GroupParticipantIdValue {
    public static from(id: string): GroupParticipantIdValue | InvalidGroupParticipantError {
        if (!id || id.trim().length === 0) {
            return new InvalidGroupParticipantError("Group participant ID cannot be empty");
        }
        return new GroupParticipantIdValue(id);
    }

    private constructor(public readonly value: string) {}
}
