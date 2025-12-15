import { processRepaymentsUseCaseFactory } from "../../../../usecases/processRepaymentsUseCaseFactory";

const INTERVAL_MS = 60 * 1000; // 1 minute

export function processRepaymentsScheduler() {
  const useCase = processRepaymentsUseCaseFactory();

  const tick = async () => {
    try {
      await useCase.execute(new Date());
    } catch (err) {
      console.error("Repayment scheduler error:", err);
    } finally {
      setTimeout(tick, INTERVAL_MS);
    }
  };

  setTimeout(tick, INTERVAL_MS);
}

