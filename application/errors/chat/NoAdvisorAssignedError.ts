export class NoAdvisorAssignedError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "NoAdvisorAssignedError";
    }
}