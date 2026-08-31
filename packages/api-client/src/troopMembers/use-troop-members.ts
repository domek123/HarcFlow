import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchTroopMembers,
  addTroopMember,
  deleteTroopMember,
  updateTroopMember,
  getTroopMembersSection,
} from "./troop-members.api";
import type { AddMemberPayload, UpdateMemberPayload } from "./types";
import { troopMembersKeys } from "../keys";

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

export function useAddMember(troopId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddMemberPayload) => addTroopMember(payload, troopId),
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
      queryClient.invalidateQueries({
        queryKey: troopMembersKeys.single(troopId),
      });
    },
  });
}

export function useUpdateTroopMember(troopId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMemberPayload) => updateTroopMember(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: troopMembersKeys.list(troopId),
      });
      queryClient.invalidateQueries({
        queryKey: troopMembersKeys.single(variables.id),
      });
    },
  });
}

export function useGetTroopMembersSection(troopId?: string) {
  return useQuery({
    queryKey: troopMembersKeys.list(troopId),
    queryFn: () => getTroopMembersSection(troopId!),
    enabled: !!troopId,
  });
}
