import {
  RawTroopMemberAttendance,
  TroopMemberAttendanceDTO,
} from "@harcapp/types";
import {
  AttendanceStatistics,
  CreateAttendanceInput,
} from "@harcapp/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { apiClient } from "../api";

export async function upsertAttendances(
  supabase: SupabaseClient,
  input: CreateAttendanceInput[],
) {
  return supabase
    .from("Attendance")
    .upsert(input, {
      onConflict: "eventId,scoutId",
    })
    .select();
}

export async function fetchTroopMembersAttendance(
  supabase: SupabaseClient,
  troopId: string,
  eventId: string,
): Promise<TroopMemberAttendanceDTO[]> {
  const { data, error } = await supabase
    .from("ScoutProfile")
    .select<string, RawTroopMemberAttendance>(
      `
      id,
      user:User!inner (
        firstName,
        lastName
      ),
      attendance:Attendance (
        status
      )
    `,
    )
    .eq("troopId", troopId)
    .eq("attendance.eventId", eventId);

  if (error) {
    console.error(
      "Błąd pobierania frekwencji członków drużyny z Supabase:",
      error,
    );
    throw error;
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    firstName: item.user?.firstName ?? "",
    lastName: item.user?.lastName ?? "",
    status: item.attendance[0]?.status ?? null,
  }));
}

export function getTroopAttendanceStatistics(troopId: string) {
  return apiClient<AttendanceStatistics>(`/attendance/stats/${troopId}`, {
    method: "GET",
  });
}
