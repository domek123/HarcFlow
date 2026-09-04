import { SupabaseClient } from "@supabase/supabase-js";
import { getTroopBadgeInventory, updateBadgeQuantity } from "./badge.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { badgesKeys } from "../keys";
import { BadgeTroopInventory, UpdateBadgeQuantityInput } from "@harcapp/types";

export const useFetchTroopBadgeInventory = (
  supabase: SupabaseClient,
  troopId?: string,
) => {
  return useQuery({
    queryKey: badgesKeys.list(troopId),
    queryFn: () => getTroopBadgeInventory(supabase, troopId!),
    enabled: !!troopId,
  });
};

export const useUpdateBadgeQuantity = (supabase: SupabaseClient) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      troopId,
      badgeId,
      delta,
    }: UpdateBadgeQuantityInput) => {
      return updateBadgeQuantity(supabase, troopId, badgeId, delta);
    },
    onMutate: async ({ troopId, badgeId, delta }) => {
      const queryKey = badgesKeys.list(troopId);

      await queryClient.cancelQueries({ queryKey });

      const previousBadges =
        queryClient.getQueryData<BadgeTroopInventory[]>(queryKey);

      queryClient.setQueryData<BadgeTroopInventory[]>(queryKey, (old) => {
        if (!old) return [];

        return old.map((badge) => {
          if (badge.id === badgeId) {
            return {
              ...badge,
              quantity: Math.max(0, badge.quantity + delta),
            };
          }
          return badge;
        });
      });

      return { previousBadges, queryKey };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBadges) {
        queryClient.setQueryData(context.queryKey, context.previousBadges);
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
};
