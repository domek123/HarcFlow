import { useState, useMemo, useCallback } from "react";

import { supabase } from "@/lib/supabase";
import {
  useFetchCurrentScoutProfile,
  useFetchTroopBadgeInventory,
  useUpdateBadgeQuantity,
} from "@harcapp/api-client";
import { BadgeTroopInventory } from "@harcapp/types";

export type ListItem =
  | { type: "header"; id: string; title: string }
  | { type: "badge"; id: string; data: BadgeTroopInventory };

export const useBadgeInventory = () => {
  const { data: currentScoutProfile } = useFetchCurrentScoutProfile(supabase);
  const { data: badges } = useFetchTroopBadgeInventory(
    supabase,
    currentScoutProfile?.troopId,
  );
  const { mutate: updateBadgeQuantity } = useUpdateBadgeQuantity(supabase);

  const [searchQuery, setSearchQuery] = useState("");

  const handleBadgeCountChange = useCallback(
    (badgeId: string, delta: number) => {
      if (!currentScoutProfile?.troopId) return;

      updateBadgeQuantity({
        troopId: currentScoutProfile?.troopId,
        badgeId,
        delta,
      });
    },
    [currentScoutProfile?.troopId, updateBadgeQuantity],
  );

  const handleBadgeQuantitySet = useCallback(
    (badgeId: string, targetQuantity: number, currentQuantity: number) => {
      if (!currentScoutProfile?.troopId) return;

      const delta = targetQuantity - currentQuantity;
      if (delta === 0) return;

      updateBadgeQuantity({
        troopId: currentScoutProfile.troopId,
        badgeId,
        delta,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentScoutProfile?.troopId],
  );

  const visibleBadges = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!badges?.length) return [];

    if (!normalizedQuery) return badges;

    return badges.filter((badge) =>
      badge.name.toLowerCase().startsWith(normalizedQuery),
    );
  }, [badges, searchQuery]);

  const flattenedData = useMemo<ListItem[]>(() => {
    if (!visibleBadges.length) return [];

    const groupsMap = new Map<string, BadgeTroopInventory[]>();
    for (const badge of visibleBadges) {
      if (!groupsMap.has(badge.category)) {
        groupsMap.set(badge.category, []);
      }
      groupsMap.get(badge.category)!.push(badge);
    }

    const items: ListItem[] = [];
    for (const [category, categoryBadges] of groupsMap.entries()) {
      items.push({
        type: "header",
        id: `header-${category}`,
        title: category,
      });

      for (const badge of categoryBadges) {
        items.push({
          type: "badge",
          id: badge.id,
          data: badge,
        });
      }
    }

    return items;
  }, [visibleBadges]);

  return {
    searchQuery,
    setSearchQuery,
    flattenedData,
    handleBadgeCountChange,
    handleBadgeQuantitySet,
    troopId: currentScoutProfile?.troopId,
  };
};
