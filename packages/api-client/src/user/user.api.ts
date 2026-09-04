import { SupabaseClient } from "@supabase/supabase-js";
import type {
  ScoutProfileDTO,
  RawScoutProfile,
  Rank,
  Degree,
  Function,
  ScoutProfileWithBadgesDTO,
  RawScoutProfileWithBadges,
} from "@harcapp/types";

export type ProfileQuery = { profileId?: string; userId?: string };

export async function fetchScoutProfile(
  supabase: SupabaseClient,
  query: ProfileQuery,
): Promise<ScoutProfileDTO | null> {
  const { profileId, userId } = query;

  if (!profileId && !userId) {
    console.error("fetchScoutProfile: Wymagane profileId lub userId");
    return null;
  }

  let builder = supabase.from("ScoutProfile").select<string, RawScoutProfile>(`
    id,
    userId,
    rank,
    degree,
    troopId,
    patrolId,
    function,
    user:User!inner (
      firstName,
      lastName,
      email,
      phoneNumber,
      birthDate,
      gender
    ),
    patrol:ScoutPatrol (
      id,
      name,
      assemblyDay,
      assemblyTime
    )
  `);

  if (profileId) {
    builder = builder.eq("id", profileId);
  } else if (userId) {
    builder = builder.eq("userId", userId);
  }

  const { data, error } = await builder.maybeSingle();

  if (error) {
    console.error("Błąd pobierania profilu harcerza:", error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    userId: data.userId,
    firstName: data.user?.firstName ?? "",
    lastName: data.user?.lastName ?? "",
    email: data.user?.email ?? "",
    phoneNumber: data.user?.phoneNumber ?? undefined,
    birthDate: data.user?.birthDate ?? "",
    gender: data.user?.gender,
    rank: data.rank as Rank,
    degree: data.degree as Degree,
    function: data.function as Function,
    troopId: data.troopId,
    patrolId: data.patrolId ?? undefined,
    patrol: data.patrol ?? null,
  } as ScoutProfileDTO;
}

export async function fetchCurrentScoutProfile(
  supabase: SupabaseClient,
): Promise<ScoutProfileDTO | null> {
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) return null;

  return fetchScoutProfile(supabase, { userId: authUser.id });
}
