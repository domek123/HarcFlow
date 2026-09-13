import { supabase } from "@/lib/supabase";
import { useFetchCurrentScoutProfile } from "@harcapp/api-client";

export function useCurrentTroopId() {
  const {
    data: currentUser,
    isLoading,
    error,
  } = useFetchCurrentScoutProfile(supabase);

  return {
    troopId: currentUser?.troopId,
    isLoading,
    error,
  };
}
