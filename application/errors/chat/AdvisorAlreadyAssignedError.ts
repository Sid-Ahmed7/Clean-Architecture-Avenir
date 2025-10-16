export class AdvisorAlreadyAssignedError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "AdvisorAlreadyAssignedError";
    }
}