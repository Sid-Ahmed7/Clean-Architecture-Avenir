import { useQuery } from "@tanstack/react-query";
import * as transactionApi from "../lib/api/transaction";
import z from "zod";
import { stockTransactionSchema } from "@/lib/validation/transaction/stockTransactionSchema";
import { useTranslations } from "next-intl";

export const TRANSACTION_KEY = "transactions";

export const useUserTransactions = () => {
const t = useTranslations();

  return useQuery({
    queryKey: [TRANSACTION_KEY, "user"],
    queryFn: async () => {
      const data = await transactionApi.getUserTransactions();
      const parsed = z.array(stockTransactionSchema(t)).safeParse(data);
      return parsed.success ? parsed.data : [];
    },
    staleTime: 30 * 1000,
  });
};

export const useTransactionsBySymbol = (symbol: string) => {
    const t = useTranslations();

  return useQuery({
    queryKey: [TRANSACTION_KEY, symbol],
    queryFn: async () => {
      const data = await transactionApi.getTransactionsBySymbol(symbol);
      const parsed = z.array(stockTransactionSchema(t)).safeParse(data);
      return parsed.success ? parsed.data : [];
    },
    enabled: !!symbol,
    staleTime: 30 * 1000,
  });
};
