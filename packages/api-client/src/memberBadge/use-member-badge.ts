import {
  AssignBadgeInput,
  BadgeStatus,
  ScoutProfileWithBadgesDTO,
} from "@harcapp/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  assignBadgeToScout,
  fetchTroopMembersWithBadges,
  updateBadgeStatus,
} from "./member-badge.api";
import { badgesKeys, badgeToBuyKeys, scoutBadgeKeys } from "../keys";

export const useFetchTroopMembersWithBadges = (
  supabase: SupabaseClient,
  troopId?: string,
) => {
  return useQuery({
    queryKey: scoutBadgeKeys.list(troopId),
    queryFn: () => fetchTroopMembersWithBadges(supabase, troopId!),
    enabled: !!troopId,
  });
};

export const useAssignBadge = (supabase: SupabaseClient, troopId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AssignBadgeInput) =>
      assignBadgeToScout(supabase, { ...input }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoutBadgeKeys.list(troopId),
      });
      queryClient.invalidateQueries({
        queryKey: badgeToBuyKeys.list(troopId),
      });
    },
  });
};

export const useUpdateBadgeStatus = (
  supabase: SupabaseClient,
  troopId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ badgeId, status, profileId }: AssignBadgeInput) =>
      updateBadgeStatus(supabase, profileId, badgeId, status),

    onMutate: async ({ profileId, badgeId, status }) => {
      await queryClient.cancelQueries({
        queryKey: scoutBadgeKeys.list(troopId),
      });

      const previousMembers = queryClient.getQueryData<
        ScoutProfileWithBadgesDTO[]
      >(scoutBadgeKeys.list(troopId));

      if (previousMembers) {
        queryClient.setQueryData<ScoutProfileWithBadgesDTO[]>(
          scoutBadgeKeys.list(troopId),
          previousMembers.map((member) => {
            if (member.id !== profileId) return member;

            return {
              ...member,
              badges: member.badges.map((badge) =>
                badge.badgeId === badgeId ? { ...badge, status } : badge,
              ),
            };
          }),
        );
      }

      return { previousMembers };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(
          scoutBadgeKeys.list(troopId),
          context.previousMembers,
        );
      }
    },

    onSettled: (_data, _error, _variables) => {
      // invalidate member badge
      queryClient.invalidateQueries({
        queryKey: scoutBadgeKeys.list(_variables.profileId),
      });

      //invalidate troop badges
      queryClient.invalidateQueries({
        queryKey: badgesKeys.list(troopId),
      });

      //invalidate badges to buy
      queryClient.invalidateQueries({
        queryKey: badgeToBuyKeys.list(troopId),
      });
    },
  });
};
