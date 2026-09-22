import { useEffect, useState } from "react";

import { useCurrentTroopId } from "@/hooks";
import { supabase } from "@/lib/supabase";
import { saveAttendances } from "@harcapp/api-client";
import {
  AttendanceStatus,
  CreateAttendanceInput,
  TroopMemberAttendanceDTO,
} from "@harcapp/types";

export function useAttendanceEditor(
  members: TroopMemberAttendanceDTO[] | undefined,
  eventId: string,
) {
  const { troopId } = useCurrentTroopId();

  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!members) return;
    setAttendance(
      Object.fromEntries(
        members.flatMap((member) =>
          member.status ? [[member.id, member.status]] : [],
        ),
      ),
    );
  }, [members]);

  const mutation = saveAttendances(
    supabase,
    (members ?? []).map((member): CreateAttendanceInput => ({
      eventId,
      scoutId: member.id,
      status: attendance[member.id] ?? member.status ?? AttendanceStatus.ABSENT,
    })),
    troopId!,
    eventId,
  );

  const getStatus = (member: TroopMemberAttendanceDTO) =>
    attendance[member.id] ?? member.status ?? AttendanceStatus.ABSENT;

  const setStatus = (memberId: string, status: AttendanceStatus) => {
    setAttendance((current) => ({ ...current, [memberId]: status }));
  };

  const setAllStatuses = (status: AttendanceStatus) => {
    setAttendance(
      Object.fromEntries((members ?? []).map((member) => [member.id, status])),
    );
  };

  const cancelEditing = () => {
    setAttendance(
      Object.fromEntries(
        (members ?? []).flatMap((member) =>
          member.status ? [[member.id, member.status]] : [],
        ),
      ),
    );
    setIsEditing(false);
  };

  return {
    attendance,
    getStatus,
    isEditing,
    setStatus,
    setAllStatuses,
    startEditing: () => setIsEditing(true),
    cancelEditing,
    mutation,
  };
}
