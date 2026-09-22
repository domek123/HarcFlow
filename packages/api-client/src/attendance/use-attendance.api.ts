import { CreateAttendanceInput } from "@harcapp/types";
import {
  fetchTroopMembersAttendance,
  upsertAttendances,
} from "./attendance.api";
import { SupabaseClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendanceKeys } from "../keys";

export function saveAttendances(
  supabase: SupabaseClient,
  input: CreateAttendanceInput[],
  troopId: string,
  eventId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => upsertAttendances(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.list(troopId, eventId),
      });
    },
  });
}

export function useTroopMembersAttendance(
  supabase: SupabaseClient,
  troopId?: string,
  eventId?: string,
) {
  return useQuery({
    queryKey: attendanceKeys.list(troopId, eventId),
    queryFn: () => fetchTroopMembersAttendance(supabase, troopId!, eventId!),
    enabled: !!troopId && !!eventId,
  });
}
