import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchTroops,
  fetchTroopDetails,
  createTroop,
  deleteTroop,
  updateTroop,
} from "./troops.api";
import type { CreateTroopPayload, UpdateTroopArgs } from "./types";

export const troopsKeys = {
  all: ["scout-troops"] as const,
  lists: () => [...troopsKeys.all, "list"] as const,
  details: () => [...troopsKeys.all, "detail"] as const,
  detail: (id?: string) => [...troopsKeys.details(), id] as const,
};

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
      queryClient.invalidateQueries({ queryKey: troopsKeys.lists() });
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
