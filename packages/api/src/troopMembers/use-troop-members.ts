import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchTroopMembers,
  addTroopMember,
  deleteTroopMember,
  updateTroopMember,
} from "./troop-members.api";
import type { AddMemberPayload, UpdateMemberPayload } from "./types";

export const troopMembersKeys = {
  all: ["scout-troop-members"] as const,
  list: (troopId?: string) => [...troopMembersKeys.all, troopId] as const,
};

export function useTroopMembersList(
  supabase: SupabaseClient,
  troopId?: string,
) {
  return useQuery({
    queryKey: troopMembersKeys.list(troopId),
    queryFn: () => fetchTroopMembers(supabase, troopId!),
    enabled: !!troopId,
  });
}

export function useAddMember(troopId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddMemberPayload) => addTroopMember(troopId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: troopMembersKeys.list(troopId),
      });
    },
  });
}

export function useDeleteTroopMember(troopId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileId: string) => deleteTroopMember(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: troopMembersKeys.list(troopId),
      });
    },
  });
}

export function useUpdateTroopMember(troopId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMemberPayload) => updateTroopMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: troopMembersKeys.list(troopId),
      });
    },
  });
}
