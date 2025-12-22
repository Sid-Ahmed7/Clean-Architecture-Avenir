export class OverdraftRequestAlreadyProcessedError extends Error {
    public constructor(message: string = "Overdraft request already processed") {
        super(message);
        this.name = "OverdraftRequestAlreadyProcessedError";
    }
}

