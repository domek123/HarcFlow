import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  useFetchTroopBadgeInventory,
  useUpdateBadgeQuantity,
} from "@harcapp/api-client";

import { supabase } from "@/lib/supabase";

export function useBadgeInventory() {
  const { id: troopId } = useParams<{ id: string }>();

  const badgeQuery = useFetchTroopBadgeInventory(supabase, troopId);
  const updateBadgeQuantity = useUpdateBadgeQuantity(supabase);

  const [badgeSearch, setBadgeSearch] = useState("");

  const visibleBadges = useMemo(() => {
    const query = badgeSearch.trim().toLowerCase();
    return (badgeQuery.data ?? []).filter(
      (badge) => !query || badge.name.toLowerCase().startsWith(query),
    );
  }, [badgeQuery.data, badgeSearch]);

  const badgeGroups = useMemo(() => {
    const groups = new Map<string, typeof visibleBadges>();
    for (const badge of visibleBadges) {
      const group = groups.get(badge.category) ?? [];
      group.push(badge);
      groups.set(badge.category, group);
    }
    return [...groups.entries()];
  }, [visibleBadges]);

  return {
    troopId,
    badgeQuery,
    badgeSearch,
    setBadgeSearch,
    badgeGroups,
    updateBadgeQuantity,
  };
}
