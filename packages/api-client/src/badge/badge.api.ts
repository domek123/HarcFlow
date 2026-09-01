import { BadgeTroopInventory, SCOUT_BADGES } from "@harcapp/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getTroopBadgeInventory(
  supabase: SupabaseClient,
  troopId: string,
): Promise<BadgeTroopInventory[]> {
  const { data: dbBadges, error } = await supabase
    .from("BadgeStore")
    .select("badgeId, quantity")
    .eq("troopId", troopId);

  if (error) {
    console.error("Błąd podczas pobierania magazynu sprawności:", error);
    throw error;
  }

  const inventoryMap = new Map<string, number>(
    dbBadges?.map((item) => [item.badgeId, item.quantity]) ?? [],
  );

  return SCOUT_BADGES.map((badge) => ({
    ...badge,
    quantity: inventoryMap.get(badge.id) ?? 0,
  }));
}

export async function updateBadgeQuantity(
  supabase: SupabaseClient,
  troopId: string,
  badgeId: string,
  delta: number,
) {
  const { data, error } = await supabase.rpc("increment_badge_quantity", {
    target_troop_id: troopId,
    target_badge_id: badgeId,
    delta_val: delta,
  });

  if (error) throw error;
  return data;
}
