import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  createParentAndLinkToUser,
  deleteParent,
  fetchUserParents,
  updateParent,
} from "./parent.api";
import { parentsKeys } from "../keys";
import { CreateParentInput, UpdateParentInput } from "@harcapp/types";

export const useFetchUserParents = (
  supabase: SupabaseClient,
  userId?: string,
) => {
  return useQuery({
    queryKey: parentsKeys.single(userId),
    queryFn: () => fetchUserParents(supabase, userId!),
    enabled: !!userId,
  });
};

export const useCreateParentAndLinkToUser = (
  supabase: SupabaseClient,
  userId?: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateParentInput) =>
      createParentAndLinkToUser(supabase, userId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: parentsKeys.single(userId),
      });
    },
  });
};

export const useUpdateParent = (supabase: SupabaseClient, userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { parentId: string; input: UpdateParentInput }) =>
      updateParent(supabase, payload.parentId, payload.input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: parentsKeys.single(userId),
      });
    },
  });
};

export const useDeleteParent = (supabase: SupabaseClient, userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (parentId: string) => deleteParent(supabase, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: parentsKeys.single(userId),
      });
    },
  });
};
