import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInventoryItem,
  deleteInventoryItem,
  fetchTroopInventory,
  incrementInventoryAmount,
  updateInventoryItem,
} from "./troop-inventory.api";
import { SupabaseClient } from "@supabase/supabase-js";
import { scoutInventoryKeys } from "../keys";
import {
  CreateInventoryItemInput,
  InventoryItem,
  UpdateInventoryItemInput,
} from "@harcapp/types";

export const useFetchTroopInventory = (
  supabase: SupabaseClient,
  troopId?: string,
) => {
  return useQuery({
    queryKey: scoutInventoryKeys.list(troopId),
    queryFn: () => fetchTroopInventory(supabase, troopId!),
    enabled: !!troopId,
  });
};

export const useCreateInventoryItem = (
  supabase: SupabaseClient,
  troopId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateInventoryItemInput) =>
      createInventoryItem(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoutInventoryKeys.list(troopId),
      });
    },
  });
};

export const useUpdateInventoryItem = (
  supabase: SupabaseClient,
  troopId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateInventoryItemInput;
    }) => updateInventoryItem(supabase, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoutInventoryKeys.list(troopId),
      });
    },
  });
};

export const useIncrementInventoryAmount = (
  supabase: SupabaseClient,
  troopId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, delta }: { itemId: string; delta: number }) =>
      incrementInventoryAmount(supabase, itemId, delta),

    onMutate: async ({ itemId, delta }) => {
      await queryClient.cancelQueries({
        queryKey: scoutInventoryKeys.list(troopId),
      });

      const previousItems = queryClient.getQueryData<InventoryItem[]>(
        scoutInventoryKeys.list(troopId),
      );

      if (previousItems) {
        queryClient.setQueryData<InventoryItem[]>(
          scoutInventoryKeys.list(troopId),
          previousItems.map((item) => {
            if (item.id === itemId) {
              const newAmount = item.amount + delta;
              return {
                ...item,
                amount: newAmount < 0 ? 0 : newAmount,
              };
            }
            return item;
          }),
        );
      }

      return { previousItems };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(
          scoutInventoryKeys.list(troopId),
          context.previousItems,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: scoutInventoryKeys.list(troopId),
      });
    },
  });
};

export const useDeleteInventoryItem = (
  supabase: SupabaseClient,
  troopId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteInventoryItem(supabase, itemId),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({
        queryKey: scoutInventoryKeys.list(troopId),
      });

      const previousItems = queryClient.getQueryData<InventoryItem[]>(
        scoutInventoryKeys.list(troopId),
      );

      if (previousItems) {
        queryClient.setQueryData<InventoryItem[]>(
          scoutInventoryKeys.list(troopId),
          previousItems.filter((item) => item.id !== itemId),
        );
      }

      return { previousItems };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(
          scoutInventoryKeys.list(troopId),
          context.previousItems,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: scoutInventoryKeys.list(troopId),
      });
    },
  });
};
