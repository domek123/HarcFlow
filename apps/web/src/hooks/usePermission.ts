import { supabase } from "@/lib/supabase";
import { useFetchUserData } from "@harcapp/api-client";

export function usePermission() {
  const { data: userData } = useFetchUserData(supabase);

  const isAdmin = userData?.role === "ADMIN";

  return {
    isAdmin,
  };
}
