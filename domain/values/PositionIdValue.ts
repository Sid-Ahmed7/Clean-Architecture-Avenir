import { InvalidUserIdError } from "../errors/InvalidUserIdError";

export class PositionIdValue {

    public static from(positionId: string) {
        if (!positionId || positionId.trim() === "") {
            return new InvalidUserIdError("Position ID cannot be empty");
        }

        return new PositionIdValue(positionId);
    }

    private constructor(public value: string) {}
}
