import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { TroopDTO } from "@harcapp/types";

export function useTroops(supabase: SupabaseClient) {
  return useQuery({
    queryKey: ['scout-troops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ScoutTroop')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as TroopDTO[];
    },
  });
}

export function useCreateTroop(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTroop: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('ScoutTroop')
        .insert([newTroop])
        .select('*')
        .single();

      if (error) throw error;
      return data as TroopDTO;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scout-troops'] });
    },
  });
}

export function useDeleteTroop(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (troopId: string) => {
      const { error } = await supabase
        .from('ScoutTroop')
        .delete()
        .eq('id', troopId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scout-troops'] });
    },
  });
}