import { processRepaymentsUseCaseFactory } from "../../../../usecases/processRepaymentsUseCaseFactory";

const INTERVAL_MS =
  process.env.REPAYMENT_INTERVAL_MS && Number(process.env.REPAYMENT_INTERVAL_MS) > 0
    ? Number(process.env.REPAYMENT_INTERVAL_MS)
    : 60 * 1000; // default 1 min in dev

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

  // start loop
  setTimeout(tick, INTERVAL_MS);
}

