import {InvalidGroupNameError} from "../errors/InvalidGroupNameError";

export class GroupNameValue {


public static from(name: string): GroupNameValue | InvalidGroupNameError {
    if (!name || name.trim().length === 0) {
      return new InvalidGroupNameError("Group name cannot be empty");
    }

    if (name.length > 50) {
      return new InvalidGroupNameError("Group name cannot exceed 50 characters");
    }

    return new GroupNameValue(name.trim());
  }

  private constructor(public readonly value: string) {}
}