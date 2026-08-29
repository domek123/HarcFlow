import { useQuery } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import { fetchCurrentScoutProfile } from "./user.api";

export function useFetchCurrentScoutProfile(supabase: SupabaseClient) {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => fetchCurrentScoutProfile(supabase),
  });
}
