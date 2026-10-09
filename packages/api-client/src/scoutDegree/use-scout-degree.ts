import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createScoutDegree,
  createScoutDegreeTask,
  deleteScoutDegreeTask,
  completeScoutDegree,
  fetchScoutDegrees,
  updateScoutDegreeTask,
  openScoutDegree,
  deleteScoutDegree,
} from "./scout-degree.api";
import { scoutDegreeKeys, troopMembersKeys } from "../keys";
import type { ScoutDegreeTask } from "@harcapp/types";

export function useScoutDegrees(scoutId?: string) {
  return useQuery({
    queryKey: scoutDegreeKeys.list(scoutId),
    queryFn: () => fetchScoutDegrees(scoutId!),
    enabled: Boolean(scoutId),
  });
}

export function useCreateScoutDegree(scoutId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) => createScoutDegree(scoutId!, templateId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: scoutDegreeKeys.list(scoutId),
      }),
  });
}

export function useUpdateScoutDegreeTask(scoutId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: Partial<
        Pick<ScoutDegreeTask, "description" | "position" | "status">
      >;
    }) => updateScoutDegreeTask(taskId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoutDegreeKeys.list(scoutId),
      });
    },
  });
}

export function useCreateScoutDegreeTask(scoutId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scoutDegreeId,
      payload,
    }: {
      scoutDegreeId: string;
      payload: Pick<ScoutDegreeTask, "description" | "position">;
    }) => createScoutDegreeTask(scoutDegreeId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoutDegreeKeys.list(scoutId),
      });
    },
  });
}

export function useDeleteScoutDegreeTask(scoutId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteScoutDegreeTask(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoutDegreeKeys.list(scoutId),
      });
    },
  });
}

export function useCompleteScoutDegree(scoutId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scoutDegreeId,
      orderNumber,
    }: {
      scoutDegreeId: string;
      orderNumber: string;
    }) => completeScoutDegree(scoutDegreeId, orderNumber),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoutDegreeKeys.list(scoutId),
      });
      queryClient.invalidateQueries({
        queryKey: troopMembersKeys.all,
      });
    },
  });
}

export function useOpenScoutDegree(scoutId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scoutDegreeId: string) => openScoutDegree(scoutDegreeId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoutDegreeKeys.list(scoutId),
      });
      queryClient.invalidateQueries({
        queryKey: troopMembersKeys.all,
      });
    },
  });
}

export function useDeleteScoutDegree(scoutId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scoutDegreeId: string) => deleteScoutDegree(scoutDegreeId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoutDegreeKeys.list(scoutId),
      });
    },
  });
}
