import { SupabaseClient } from "@supabase/supabase-js";
import type {
  ScoutProfileDTO,
  Rank,
  Degree,
  Function,
  RawScoutProfile,
  TroopMemberSectionDTO,
} from "@harcapp/types";

import type { AddMemberPayload, UpdateMemberPayload } from "./types";

import { apiClient } from "../api";

export async function fetchTroopMembers(
  supabase: SupabaseClient,
  troopId: string,
): Promise<ScoutProfileDTO[]> {
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
    .eq("troopId", troopId);

  if (error) {
    console.error("Błąd pobierania członków drużyny z Supabase:", error);
    throw error;
  }

  if (!data) return [];

  return data.map((item) => ({
    id: item.id,
    userId: item.userId,
    firstName: item.user?.firstName ?? "",
    lastName: item.user?.lastName ?? "",
    email: item.user?.email ?? "",
    phoneNumber: item.user?.phoneNumber ?? undefined,
    birthDate: item.user?.birthDate ?? "",
    gender: item.user?.gender,
    rank: item.rank as Rank,
    degree: item.degree as Degree,
    function: item.function as Function,
  })) as ScoutProfileDTO[];
}

export function addTroopMember(troopId: string, payload: AddMemberPayload) {
  return apiClient<ScoutProfileDTO>("/troop-members", {
    method: "POST",
    body: JSON.stringify({ ...payload, troopId }),
  });
}

export function deleteTroopMember(profileId: string) {
  return apiClient<{ success: boolean }>(`/troop-members/${profileId}`, {
    method: "DELETE",
  });
}

export function updateTroopMember(payload: UpdateMemberPayload) {
  return apiClient<ScoutProfileDTO>(`/troop-members/${payload.id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getTroopMembersSection(troopId: string) {
  return apiClient<TroopMemberSectionDTO[]>(
    `/troop-members/section/${troopId}`,
    { method: "GET" },
  );
}
