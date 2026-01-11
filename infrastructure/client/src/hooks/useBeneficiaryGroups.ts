import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as beneficiaryGroupApi from "@/lib/api/groupBeneficiary";
import { BeneficiaryGroup } from "@/types/beneficiaryGroup";
import { CreateBeneficiaryGroupRequest, UpdateBeneficiaryGroupRequest } from "@/types/beneficiaryGroup";
import { TransferToGroupRequest, GroupTransferResponse } from "@/types/transfer";
import { useTranslations } from "next-intl";
import { createBeneficiaryGroupSchema } from "@/lib/validation/beneficiary/createBeneficiaryGroupSchema";

export const BENEFICIARY_GROUP_QUERY_KEY = "beneficiaryGroups";

export const useBeneficiaryGroups = () => {
  return useQuery<BeneficiaryGroup[]>({
    queryKey: [BENEFICIARY_GROUP_QUERY_KEY],
    queryFn: async () => {
      try {
        const fetchGroups = await beneficiaryGroupApi.getBeneficiaryGroups();
        return Array.isArray(fetchGroups) ? fetchGroups : [];
      } catch (err) {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useBeneficiaryGroupMutations = () => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const createBeneficiaryGroup = useMutation<
    { data: BeneficiaryGroup | null; error: string | null },
    Error,
    CreateBeneficiaryGroupRequest
  >({
    mutationFn: async (group) => {
      try {
        const newGroup = await beneficiaryGroupApi.createBeneficiaryGroup(group);
        const parsed = createBeneficiaryGroupSchema(t).safeParse(group);
        if (!parsed.success) {
          return {
            data: null,
            error: t('generalErrors.beneficiaryGroups.create'),
          };
        }

        return { data: newGroup, error: null };
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        return {
          data: null,
          error: error.response?.data?.error || error.message || t('generalErrors.beneficiaryGroups.create'),
        };
      }
    },
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData<BeneficiaryGroup[]>([BENEFICIARY_GROUP_QUERY_KEY], (old) => {
          if (!old) return [result.data!];
          return [...old, result.data!];
        });
      }
    },
  });

  const updateBeneficiaryGroup = useMutation<
    { data: BeneficiaryGroup | null; error: string | null },
    Error,
    { groupId: string; updates: UpdateBeneficiaryGroupRequest }
  >({
    mutationFn: async ({ groupId, updates }) => {
      try {
        const updatedGroup = await beneficiaryGroupApi.updateBeneficiaryGroup(groupId, updates);
        return { data: updatedGroup, error: null };
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        return {
          data: null,
          error: error.response?.data?.error || error.message || t('generalErrors.beneficiaryGroups.update'),
        };
      }
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData<BeneficiaryGroup[]>([BENEFICIARY_GROUP_QUERY_KEY], (old) => {
          if (!old) return old;
          return old.map((g) => (g.groupId === variables.groupId ? result.data! : g));
        });
      }
    },
  });

  const deleteBeneficiaryGroup = useMutation<
    { success: boolean; error: string | null },
    Error,
    string
  >({
    mutationFn: async (groupId) => {
      try {
        await beneficiaryGroupApi.deleteBeneficiaryGroup(groupId);
        return { success: true, error: null };
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        return {
          success: false,
          error: error.response?.data?.error || error.message || t('generalErrors.beneficiaryGroups.delete'),
        };
      }
    },
    onSuccess: (result, groupId) => {
      if (result.success) {
        queryClient.setQueryData<BeneficiaryGroup[]>([BENEFICIARY_GROUP_QUERY_KEY], (old) =>
          old ? old.filter((g) => g.groupId !== groupId) : []
        );
      }
    },
  });

  const addBeneficiaryToGroup = useMutation<
    { data: BeneficiaryGroup | null; error: string | null },
    Error,
    { groupId: string; beneficiaryId: string }
  >({
    mutationFn: async ({ groupId, beneficiaryId }) => {
      try {
        const updatedGroup = await beneficiaryGroupApi.addBeneficiaryToGroup(groupId, beneficiaryId);
        return { data: updatedGroup, error: null };
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        return {
          data: null,
          error: error.response?.data?.error || error.message || t('generalErrors.beneficiaryGroups.create'),
        };
      }
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData<BeneficiaryGroup[]>([BENEFICIARY_GROUP_QUERY_KEY], (old) => {
          if (!old) return old;
          return old.map((g) => (g.groupId === variables.groupId ? result.data! : g));
        });
      }
    },
  });

  const removeBeneficiaryFromGroup = useMutation<
    { data: BeneficiaryGroup | null; error: string | null },
    Error,
    { groupId: string; beneficiaryId: string }
  >({
    mutationFn: async ({ groupId, beneficiaryId }) => {
      try {
        const updatedGroup = await beneficiaryGroupApi.removeBeneficiaryFromGroup(groupId, beneficiaryId);
        return { data: updatedGroup, error: null };
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        return {
          data: null,
          error: error.response?.data?.error || error.message || t('generalErrors.beneficiaryGroups.removeBeneficiary'),
        };
      }
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData<BeneficiaryGroup[]>([BENEFICIARY_GROUP_QUERY_KEY], (old) => {
          if (!old) return old;
          return old.map((g) => (g.groupId === variables.groupId ? result.data! : g));
        });
      }
    },
  });

  const transferToGroup = useMutation<
    { data: GroupTransferResponse | null; error: string | null },
    Error,
    { groupId: string; transferData: TransferToGroupRequest }
  >({
    mutationFn: async ({ groupId, transferData }) => {
      try {
        const result = await beneficiaryGroupApi.transferToGroup(groupId, transferData);
        return { data: result, error: null };
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        return {
          data: null,
          error: error.response?.data?.error || error.message || t('generalErrors.beneficiaryGroups.create'),
        };
      }
    },
  });

  return {
    createBeneficiaryGroup,
    updateBeneficiaryGroup,
    deleteBeneficiaryGroup,
    addBeneficiaryToGroup,
    removeBeneficiaryFromGroup,
    transferToGroup,
  };
};
