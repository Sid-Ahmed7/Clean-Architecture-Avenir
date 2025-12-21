import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseIPOShares, closeIPO, openIPO } from "@/lib/api/ipo";

export function usePurchaseIPOShares() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseIPOShares,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
}

export function useCloseIPO() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeIPO,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
  });
}

export function useOpenIPO() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ symbol, shares }: { symbol: string; shares?: number, ipoType?: 'INITIAL' | 'SECONDARY' }) =>
      openIPO(symbol, shares),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
  });
}
