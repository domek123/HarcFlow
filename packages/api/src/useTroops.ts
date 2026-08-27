import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { TroopDTO } from "@harcapp/types";

export function useTroops(supabase: SupabaseClient) {
  return useQuery({
    queryKey: ["scout-troops"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ScoutTroop")
        .select("*, ScoutProfile(count)")
        .order("name", { ascending: true });

      if (error) throw error;

      return data.map((troop) => ({
        ...troop,
        memberCount: troop.ScoutProfile[0]?.count || 0,
      })) as TroopDTO[];
    },
  });
}

export function useTroopDetails(supabase: SupabaseClient, troopId?: string) {
  return useQuery({
    queryKey: ["scout-troop", troopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ScoutTroop")
        .select("*")
        .eq("id", troopId)
        .single();

      if (error) throw error;
      return data as TroopDTO;
    },
    enabled: !!troopId,
  });
}

export function useCreateTroop(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTroop: { name?: string; description?: string }) => {
      const { data, error } = await supabase
        .from("ScoutTroop")
        .insert([newTroop])
        .select("*")
        .single();

      if (error) throw error;
      return data as TroopDTO;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scout-troops"] });
    },
  });
}

export function useDeleteTroop(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (troopId: string) => {
      const { error } = await supabase
        .from("ScoutTroop")
        .delete()
        .eq("id", troopId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scout-troops"] });
    },
  });
}
interface UpdateTroopArgs {
  id: string;
  dto: Partial<Omit<TroopDTO, "id">>;
}

export function useUpdateTroop(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: UpdateTroopArgs) => {
      console.log(dto);
      const { data, error } = await supabase
        .from("ScoutTroop")
        .update(dto)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as TroopDTO;
    },
    onSuccess: (updatedTroop, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["scout-troop", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["scout-troops"],
      });
    },
  });
}
