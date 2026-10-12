import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchTroopMembers,
  addTroopMember,
  deleteTroopMember,
  updateTroopMember,
  getTroopMembersSection,
  getScoutsDevelopmentProfile,
  updateDegree,
} from "./troop-members.api";
import type { AddMemberPayload, UpdateMemberPayload } from "./types";
import { attendanceKeys, contactKeys, troopMembersKeys } from "../keys";
import { Degree } from "@harcapp/types";

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
        queryKey: troopMembersKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: attendanceKeys.statistics(troopId),
      });

      queryClient.invalidateQueries({
        queryKey: contactKeys.children(troopId),
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
        queryKey: troopMembersKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: attendanceKeys.statistics(troopId),
      });

      queryClient.invalidateQueries({
        queryKey: contactKeys.all,
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
        queryKey: troopMembersKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: contactKeys.children(troopId),
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

export function useGetScoutsDevelopmentProfile(
  supabase: SupabaseClient,
  troopId?: string,
) {
  return useQuery({
    queryKey: troopMembersKeys.developmentProfile(troopId),
    queryFn: () => getScoutsDevelopmentProfile(supabase, troopId!),
    enabled: !!troopId,
  });
}

export function useUpdateDegree(troopId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      profileId: string;
      degree: Degree;
      acquiringDegree: Degree;
    }) =>
      updateDegree(payload.profileId, {
        degree: payload.degree,
        acquiringDegree: payload.acquiringDegree,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: troopMembersKeys.developmentProfile(troopId),
      });
    },
  });
}
