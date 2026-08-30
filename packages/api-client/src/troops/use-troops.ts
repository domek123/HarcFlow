import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchTroops,
  fetchTroopDetails,
  createTroop,
  deleteTroop,
  updateTroop,
  fetchTroopDetailsWithPatrols,
} from "./troops.api";
import type { CreateTroopPayload, UpdateTroopArgs } from "./types";
import { troopsKeys } from "../keys";

export function useTroops(supabase: SupabaseClient) {
  return useQuery({
    queryKey: troopsKeys.lists(),
    queryFn: () => fetchTroops(supabase),
  });
}

export function useTroopDetails(supabase: SupabaseClient, troopId?: string) {
  return useQuery({
    queryKey: troopsKeys.detail(troopId),
    queryFn: () => fetchTroopDetails(supabase, troopId!),
    enabled: !!troopId,
  });
}

export function useTroopDetailsWithPatrols(
  supabase: SupabaseClient,
  troopId?: string,
) {
  return useQuery({
    queryKey: troopsKeys.patrols(troopId),
    queryFn: () => fetchTroopDetailsWithPatrols(supabase, troopId!),
    enabled: !!troopId,
  });
}

export function useCreateTroop(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTroop: CreateTroopPayload) =>
      createTroop(supabase, newTroop),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: troopsKeys.lists() });
    },
  });
}

export function useDeleteTroop(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (troopId: string) => deleteTroop(supabase, troopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: troopsKeys.all });
    },
  });
}

export function useUpdateTroop(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: UpdateTroopArgs) => updateTroop(supabase, args),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: troopsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: troopsKeys.lists(),
      });
    },
  });
}
