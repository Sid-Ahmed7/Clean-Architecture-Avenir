import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as beneficiaryApi from "@/lib/api/beneficiary";
import { CreateBeneficiaryRequest, UpdateBeneficiaryRequest, Beneficiary } from "@/types/beneficiary";
import { TransferToBeneficiaryRequest, TransferResponse } from "@/types/transfer";
import { useTranslations } from "next-intl";
import { createBeneficiarySchema } from "@/lib/validation/beneficiary/createBeneficiarySchema";
import { updateBeneficiarySchema } from "@/lib/validation/beneficiary/updateBeneficiarySchema";

export const BENEFICIARY_QUERY_KEY = "beneficiaries";

export const useBeneficiaries = () => {

  return useQuery<Beneficiary[]>({
    queryKey: [BENEFICIARY_QUERY_KEY],
    queryFn: async () => {
      try {
        const fetchBeneficiaries = await beneficiaryApi.getBeneficiaries();
        return Array.isArray(fetchBeneficiaries) ? fetchBeneficiaries : [];
      } catch (err) {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useBeneficiaryMutations = () => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const createBeneficiary = useMutation<
    { data: Beneficiary | null; error: string | null },
    Error,
    CreateBeneficiaryRequest
  >({
    mutationFn: async (beneficiary) => {
      try {
        const newBeneficiary = await beneficiaryApi.createBeneficiary(beneficiary);
        const parsed = createBeneficiarySchema(t).safeParse(beneficiary);
        if (!parsed.success) {
          return {
            data: null,
            error: t('generalErrors.beneficiaries.validation'),
          };
        }

        return { data: newBeneficiary, error: null };
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };

        return {
          data: null,
          error: error.response?.data?.error || error.message || t('generalErrors.beneficiaries.create'),
        };
      }
    },
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData<Beneficiary[]>([BENEFICIARY_QUERY_KEY], (old) => {
          if (!old) return [result.data!];
          return [...old, result.data!];
        });
      }
    },
  });

  const updateBeneficiary = useMutation<
    { data: Beneficiary | null; error: string | null },
    Error,
    { beneficiaryId: string; beneficiary: UpdateBeneficiaryRequest }
  >({
    mutationFn: async ({ beneficiaryId, beneficiary }) => {
      try {
        const updatedBeneficiary = await beneficiaryApi.updateBeneficiary(
          beneficiaryId,
          beneficiary
        );
        const parsed = updateBeneficiarySchema(t).safeParse(beneficiary);
        if (!parsed.success) {
          return {
            data: null,
            error: t('generalErrors.beneficiaries.validation'),
          };
        }
        return { data: updatedBeneficiary, error: null };
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        return {
          data: null,
          error: error.response?.data?.error || error.message || t('generalErrors.beneficiaries.update'),
        };
      }
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData<Beneficiary[]>([BENEFICIARY_QUERY_KEY], (old) => {
          if (!old) return old;
          return old.map((b) => (b.beneficiaryId === variables.beneficiaryId ? result.data! : b));
        });
      }
    },
  });

  const deleteBeneficiary = useMutation<
    { success: boolean; error: string | null },
    Error,
    string
  >({
    mutationFn: async (beneficiaryId) => {
      try {
        await beneficiaryApi.deleteBeneficiary(beneficiaryId);
        return { success: true, error: null };
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        return {
          success: false,
          error: error.response?.data?.error || error.message || t('generalErrors.beneficiaries.delete'),
        };
      }
    },
    onSuccess: (result, beneficiaryId) => {
      if (result.success) {
        queryClient.setQueryData<Beneficiary[]>([BENEFICIARY_QUERY_KEY], (old) =>
          old ? old.filter((b) => b.beneficiaryId !== beneficiaryId) : []
        );
      }
    },
  });

  const transferToBeneficiary = useMutation<
    { data: TransferResponse | null; error: string | null },
    Error,
    TransferToBeneficiaryRequest
  >({
    mutationFn: async (transferData) => {
      try {
        const result = await beneficiaryApi.transferToBeneficiary(transferData);
        return { data: result, error: null };
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        return {
          data: null,
          error: error.response?.data?.error || error.message || t('generalErrors.beneficiaries.transfer'),
        };
      }
    },
  });

  return {
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    transferToBeneficiary,
  };
};
