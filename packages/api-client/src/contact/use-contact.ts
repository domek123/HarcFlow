import { useQuery } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";

import { contactKeys } from "../keys";
import { fetchChildrenContacts, fetchParentsContacts } from "./contact.api";

export function useChildrenContacts(
  supabase: SupabaseClient,
  troopId?: string,
) {
  return useQuery({
    queryKey: contactKeys.children(troopId ?? ""),
    queryFn: () => fetchChildrenContacts(supabase, troopId ?? ""),
    enabled: Boolean(troopId),
  });
}

export function useParentsContacts(supabase: SupabaseClient, troopId?: string) {
  return useQuery({
    queryKey: contactKeys.parents(troopId ?? ""),
    queryFn: () => fetchParentsContacts(supabase, troopId ?? ""),
    enabled: Boolean(troopId),
  });
}
