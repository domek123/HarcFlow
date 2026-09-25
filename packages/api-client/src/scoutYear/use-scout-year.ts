import { CreateScoutYearPayload } from "@harcapp/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchScoutYears,
  createScoutYear,
  deleteScoutYear,
  fetchCurrentScoutYear,
} from "./scout-year.api";
import { scoutYearKeys } from "../keys";

export function useScoutYears(supabase: SupabaseClient) {
  return useQuery({
    queryKey: scoutYearKeys.lists(),
    queryFn: () => fetchScoutYears(supabase),
  });
}

export function useCurrentScoutYear(supabase: SupabaseClient) {
  return useQuery({
    queryKey: scoutYearKeys.current(),
    queryFn: () => fetchCurrentScoutYear(supabase),
  });
}

export function useCreateScoutYear(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newScoutYear: CreateScoutYearPayload) =>
      createScoutYear(supabase, newScoutYear),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scoutYearKeys.all });
    },
  });
}

export function useDeleteScoutYear(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scoutYearId: string) => deleteScoutYear(supabase, scoutYearId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scoutYearKeys.all });
    },
  });
}
