import { SupabaseClient } from "@supabase/supabase-js";
import type {
  ScoutProfileDTO,
  Rank,
  Degree,
  Function,
  RawScoutProfile,
  TroopMemberSectionDTO,
  RawScoutProfileDevelopmentDTO,
  ScoutProfileDevelopmentDTO,
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
      acquiringDegree,
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

export function addTroopMember(payload: AddMemberPayload, troopId?: string) {
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

export async function getScoutsDevelopmentProfile(
  supabase: SupabaseClient,
  troopId: string,
) {
  const { data, error } = await supabase
    .from("ScoutProfile")
    .select<string, RawScoutProfileDevelopmentDTO>(
      `
      id,
      userId,
      rank,
      degree,
      acquiringDegree,
      user:User!inner (
        firstName,
        lastName,
        birthDate
      ),
      badges:UserBadge (
        badgeId,
        status
      )
    `,
    )
    .eq("troopId", troopId)
    .order("function", { ascending: true })
    .order("degree", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map((item) => ({
    id: item.id,
    firstName: item.user?.firstName,
    lastName: item.user?.lastName,
    birthDate: item.user?.birthDate,
    rank: item.rank,
    degree: item.degree,
    acquiringDegree: item.acquiringDegree,
    badges: item.badges,
  })) as ScoutProfileDevelopmentDTO[];
}

export function updateDegree(
  profileId: string,
  payload: { degree: Degree; acquiringDegree: Degree },
) {
  return apiClient<ScoutProfileDTO>(`/troop-members/${profileId}/degree`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
