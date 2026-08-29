import { SupabaseClient } from "@supabase/supabase-js";
import type {
  ScoutProfileDTO,
  RawScoutProfile,
  Rank,
  Degree,
  Function,
} from "@harcapp/types";

export async function fetchCurrentScoutProfile(
  supabase: SupabaseClient,
): Promise<ScoutProfileDTO | null> {
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    console.error(
      "Błąd pobierania zalogowanego użytkownika z Auth:",
      authError,
    );
    return null;
  }

  const { data, error } = await supabase
    .from("ScoutProfile")
    .select<string, RawScoutProfile>(
      `
      id,
      userId,
      rank,
      degree,
      function,
      user:User!inner (
        firstName,
        lastName,
        email,
        phoneNumber,
        birthDate,
        gender
      )
    `,
    )
    .eq("userId", authUser.id)
    .single();

  if (error) {
    console.error("Błąd pobierania profilu zalogowanego użytkownika:", error);
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
  } as ScoutProfileDTO;
}
