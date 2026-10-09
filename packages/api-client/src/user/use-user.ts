import { useQuery } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchCurrentScoutProfile,
  fetchScoutProfile,
  fetchUserData,
} from "./user.api";
import { troopMembersKeys } from "../keys";

export function useFetchCurrentScoutProfile(supabase: SupabaseClient) {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => fetchCurrentScoutProfile(supabase),
  });
}

export function useFetchScoutProfile(
  supabase: SupabaseClient,
  profileId: string,
) {
  return useQuery({
    queryKey: troopMembersKeys.single(profileId),
    queryFn: () => fetchScoutProfile(supabase, { profileId }),
    enabled: !!profileId,
  });
}

export function useFetchUserData(supabase: SupabaseClient) {
  return useQuery({
    queryKey: ["user-data"],
    queryFn: () => fetchUserData(supabase),
  });
}
