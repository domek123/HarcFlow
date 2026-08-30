import { SupabaseClient } from "@supabase/supabase-js";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  createPatrol,
  deletePatrol,
  fetchPatrols,
  updatePatrol,
} from "./patrol.api";
import type { CreatePatrolPayload, PatrolDTO } from "@harcapp/types";
import { patrolsKeys, troopsKeys } from "../keys";

export function useFetchPatrols(supabase: SupabaseClient, troopId?: string) {
  return useQuery({
    queryKey: patrolsKeys.troop(troopId),
    queryFn: () => fetchPatrols(supabase, troopId!),
    enabled: !!troopId,
  });
}

export function useCreatePatrol(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPatrol: CreatePatrolPayload) =>
      createPatrol(supabase, newPatrol),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: troopsKeys.patrols(variables.troopId),
      });
      queryClient.invalidateQueries({
        queryKey: patrolsKeys.troop(variables.troopId),
      });
    },
  });
}

export function useDeletePatrol(supabase: SupabaseClient, troopId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patrolId: string) => deletePatrol(supabase, patrolId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: troopsKeys.patrols(troopId),
      });
      queryClient.invalidateQueries({
        queryKey: patrolsKeys.troop(troopId),
      });
    },
  });
}

export function useUpdatePatrol(supabase: SupabaseClient, troopId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: Partial<PatrolDTO>) => updatePatrol(supabase, args),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: troopsKeys.patrols(troopId),
      });
      queryClient.invalidateQueries({
        queryKey: patrolsKeys.troop(troopId),
      });
    },
  });
}
