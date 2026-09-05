import { useCallback, useState } from "react";

import { supabase } from "@/lib/supabase";
import {
  useAssignBadge,
  useFetchCurrentScoutProfile,
  useFetchTroopMembersWithBadges,
  useUpdateBadgeStatus,
} from "@harcapp/api-client";
import {
  AssignBadgeInput,
  BadgeStatus,
  ScoutProfileWithBadgesDTO,
} from "@harcapp/types";

export const useManageMemberBadges = () => {
  const { data: profile } = useFetchCurrentScoutProfile(supabase);
  const troopId = profile?.troopId;

  const { data: members, isLoading } = useFetchTroopMembersWithBadges(
    supabase,
    troopId,
  );
  const assignBadge = useAssignBadge(supabase, troopId);
  const updateStatus = useUpdateBadgeStatus(supabase, troopId ?? "");

  const [assigningMember, setAssigningMember] =
    useState<ScoutProfileWithBadgesDTO>();

  const openAssign = useCallback((member: ScoutProfileWithBadgesDTO) => {
    setAssigningMember(member);
  }, []);

  const assign = useCallback(
    (badgeId: string) => {
      if (!assigningMember) return;

      const input: AssignBadgeInput = {
        profileId: assigningMember.id,
        badgeId,
        status: BadgeStatus.PLANNED,
      };

      assignBadge.mutate(input, {
        onSuccess: () => setAssigningMember(undefined),
      });
    },
    [assignBadge, assigningMember],
  );

  const changeStatus = useCallback(
    (profileId: string, badgeId: string, nextStatus: BadgeStatus) =>
      updateStatus.mutate({ profileId, badgeId, status: nextStatus }),
    [updateStatus],
  );

  return {
    troopId,
    members,
    isLoading,
    assigningMember,
    openAssign,
    assign,
    changeStatus,
    assignBadge,
    setAssigningMember,
  };
};
