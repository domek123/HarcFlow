import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { EventFormValues } from "@harcapp/validators";
import {
  createEvent,
  deleteEvent,
  fetchEventsPage,
  updateEvent,
} from "./events.api";
import { SupabaseClient } from "@supabase/supabase-js";
import { attendanceKeys, eventKeys } from "../keys";
import { CreateEventInput } from "packages/types/src/event";

export function useEvents(
  supabase: SupabaseClient,
  currentYear: string | undefined,
  troopId?: string,
  pageSize: number = 10,
) {
  return useInfiniteQuery({
    queryKey: eventKeys.list(troopId),
    queryFn: ({ pageParam = 0 }) =>
      fetchEventsPage(supabase, troopId!, pageParam, pageSize, currentYear!),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length : undefined,
    enabled: Boolean(troopId) && Boolean(currentYear),
  });
}

export function useCreateEvent(supabase: SupabaseClient, troopId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateEventInput) =>
      createEvent(supabase, troopId!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.list(troopId),
      });

      queryClient.invalidateQueries({
        queryKey: attendanceKeys.statistics(troopId),
      });
    },
  });
}

export function useUpdateEvent(supabase: SupabaseClient, troopId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      values,
    }: {
      eventId: string;
      values: CreateEventInput;
    }) => updateEvent(supabase, eventId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.list(troopId),
      });

      queryClient.invalidateQueries({
        queryKey: attendanceKeys.statistics(troopId),
      });
    },
  });
}

export function useDeleteEvent(supabase: SupabaseClient, troopId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => deleteEvent(supabase, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.list(troopId),
      });

      queryClient.invalidateQueries({
        queryKey: attendanceKeys.statistics(troopId),
      });
    },
  });
}
