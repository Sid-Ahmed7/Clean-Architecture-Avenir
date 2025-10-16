export class SameAdvisorError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "SameAdvisorError"
    }
}