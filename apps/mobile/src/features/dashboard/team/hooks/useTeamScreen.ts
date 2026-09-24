import { useState, useMemo, useCallback } from "react";

import { useCurrentTroopId } from "@/hooks/useCurrentTroopId";
import { supabase } from "@/lib/supabase";
import {
  useGetTroopMembersSection,
  useTroopDetailsWithPatrols,
} from "@harcapp/api-client";
import { TroopMemberSectionDTO, Function, DegreeMaxAge } from "@harcapp/types";
import { getAgeFromBirthDate } from "@harcapp/utils";

import { sortMembersByRank } from "../utils/sortMembersByRank";

export interface PatrolGroup {
  id: string;
  name: string;
  assemblyDay: number;
  assemblyTime: string;
  members: TroopMemberSectionDTO[];
}

export function useTeamScreen() {
  const { troopId } = useCurrentTroopId();

  const { data: troop, isLoading: troopLoading } = useTroopDetailsWithPatrols(
    supabase,
    troopId,
  );

  const {
    data: members = [],
    isLoading: membersLoading,
    isRefetching,
    refetch,
  } = useGetTroopMembersSection(troopId);

  const [search, setSearch] = useState("");

  const searchedMembers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return members;

    return members.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      return fullName.includes(searchTerm);
    });
  }, [members, search]);

  const { staffMembers, patrolGroups, unassignedMembers } = useMemo(() => {
    const rawStaff: TroopMemberSectionDTO[] = [];
    const rawUnassigned: TroopMemberSectionDTO[] = [];

    const groupsMap = new Map<string, PatrolGroup>();

    troop?.patrols.forEach((patrol) => {
      groupsMap.set(patrol.id, {
        id: patrol.id,
        name: patrol.name,
        assemblyDay: patrol.assemblyDay,
        assemblyTime: patrol.assemblyTime,
        members: [],
      });
    });

    searchedMembers.forEach((member) => {
      if (
        member.function === Function.DRUZYNOWY ||
        member.function === Function.PRZYBOCZNY
      ) {
        rawStaff.push(member);
        return;
      }

      if (!member.patrolId) {
        rawUnassigned.push(member);
        return;
      }

      let group = groupsMap.get(member.patrolId);

      if (!group) {
        group = {
          id: member.patrolId,
          name: "Nieznany zastęp",
          assemblyDay: 1,
          assemblyTime: "18:00",
          members: [],
        };
        groupsMap.set(member.patrolId, group);
      }

      group.members.push(member);
    });

    const sortedStaff = sortMembersByRank(rawStaff);
    const sortedUnassigned = sortMembersByRank(rawUnassigned);

    const sortedPatrolGroups = Array.from(groupsMap.values())
      .map((group) => ({
        ...group,
        members: sortMembersByRank(group.members),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "pl"));

    return {
      staffMembers: sortedStaff,
      patrolGroups: sortedPatrolGroups,
      unassignedMembers: sortedUnassigned,
    };
  }, [searchedMembers, troop?.patrols]);

  const adequateDegreesPercentage = useMemo(() => {
    const totalMembers = members.length;
    if (totalMembers === 0) return 0;

    const adequateMembersCount = members.reduce((acc, member) => {
      const age = getAgeFromBirthDate(member.birthDate);
      if (age !== undefined && age <= DegreeMaxAge[member.degree]) {
        acc++;
      }
      return acc;
    }, 0);

    return ((adequateMembersCount / totalMembers) * 100).toFixed(0);
  }, [members]);

  const onRefresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Błąd podczas odświeżania sekcji drużyny:", error);
    }
  }, [refetch]);

  return {
    troop,
    troopLoading,
    membersLoading,
    staffMembers,
    patrolGroups,
    unassignedMembers,
    totalMembers: members.length,
    search,
    setSearch,
    refreshing: isRefetching,
    onRefresh,
    adequateDegreesPercentage,
  };
}
