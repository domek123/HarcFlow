import {
  ScoutProfileWithBadgesDTO,
  RawScoutProfileWithBadges,
  BadgeStatus,
  AssignBadgeInput,
} from "@harcapp/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchTroopMembersWithBadges(
  supabase: SupabaseClient,
  troopId: string,
): Promise<ScoutProfileWithBadgesDTO[]> {
  const { data, error } = await supabase
    .from("ScoutProfile")
    .select<string, RawScoutProfileWithBadges>(
      `
    id,
    user:User!inner (
      firstName,
      lastName
    ),
    badges:UserBadge (
      badgeId,
      status
    )
  `,
    )
    .eq("troopId", troopId);

  if (error) {
    console.error(
      "[fetchTroopMembersWithBadges] Błąd pobierania profilu:",
      error,
    );
    throw error;
  }
  if (!data) return [];

  return data
    .map((profile) => ({
      id: profile.id,
      firstName: profile.user?.firstName ?? "",
      lastName: profile.user?.lastName ?? "",
      badges: profile.badges ?? [],
    }))
    .sort((a, b) => b.badges.length - a.badges.length);
}

export async function assignBadgeToScout(
  supabase: SupabaseClient,
  input: AssignBadgeInput,
) {
  const { data, error } = await supabase
    .from("UserBadge")
    .insert({
      profileId: input.profileId,
      badgeId: input.badgeId,
      status: input.status ?? "PLANNED",
    })
    .select()
    .single();

  if (error) {
    console.error("[assignBadgeToScout] Błąd przydzielania sprawności:", error);
    throw new Error(`Nie udało się przydzielić sprawności: ${error.message}`);
  }

  return data;
}

export async function updateBadgeStatus(
  supabase: SupabaseClient,
  profileId: string,
  badgeId: string,
  newStatus: BadgeStatus,
) {
  const { data, error } = await supabase
    .from("UserBadge")
    .update({ status: newStatus })
    .match({ profileId, badgeId })
    .select()
    .single();

  if (error) {
    console.error("[updateBadgeStatus] Błąd aktualizacji statusu:", error);
    throw new Error(
      `Nie udało się zaktualizować statusu sprawności: ${error.message}`,
    );
  }

  return data;
}
