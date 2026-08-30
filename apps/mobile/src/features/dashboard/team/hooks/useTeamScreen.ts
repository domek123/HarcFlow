import { useState, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  useFetchCurrentScoutProfile,
  useGetTroopMembersSection,
  useTroopDetailsWithPatrols,
} from "@harcapp/api-client";
import type { TroopMemberSectionDTO, Function } from "@harcapp/types";
import { sortMembersByRank } from "../utils/sortMembersByRank";

export interface PatrolGroup {
  id: string;
  name: string;
  assemblyDay: number;
  assemblyTime: string;
  members: TroopMemberSectionDTO[];
}

export const useTeamScreen = () => {
  const { data: profile, isLoading: profileLoading } =
    useFetchCurrentScoutProfile(supabase);

  const { data: troop, isLoading: troopLoading } = useTroopDetailsWithPatrols(
    supabase,
    profile?.troopId,
  );

  const {
    data: members = [],
    isLoading: membersLoading,
    isRefetching,
    refetch,
  } = useGetTroopMembersSection(profile?.troopId);

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
        member.function === ("DRUZYNOWY" as Function) ||
        member.function === ("PRZYBOCZNY" as Function)
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

  const onRefresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Błąd podczas odświeżania sekcji drużyny:", error);
    }
  }, [refetch]);

  return {
    profileLoading,
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
  };
};
