import type { ScoutDegree, ScoutDegreeTask } from "@harcapp/types";
import { apiClient } from "../api";

export function fetchScoutDegrees(scoutId: string) {
  return apiClient<ScoutDegree[]>(`/scout-degrees/${scoutId}`);
}

export function createScoutDegree(scoutId: string, templateId: string) {
  return apiClient<ScoutDegree>(`/scout-degrees/${scoutId}`, {
    method: "POST",
    body: JSON.stringify({ templateId }),
  });
}

export function createScoutDegreeTask(
  scoutDegreeId: string,
  payload: Pick<ScoutDegreeTask, "description" | "position">,
) {
  return apiClient<ScoutDegreeTask>(`/scout-degrees/${scoutDegreeId}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateScoutDegreeTask(
  taskId: string,
  payload: Partial<
    Pick<ScoutDegreeTask, "description" | "position" | "status">
  >,
) {
  return apiClient<ScoutDegreeTask>(`/scout-degrees/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteScoutDegreeTask(taskId: string) {
  return apiClient<void>(`/scout-degrees/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export function completeScoutDegree(
  scoutDegreeId: string,
  orderNumber: string,
) {
  return apiClient<ScoutDegree>(`/scout-degrees/${scoutDegreeId}/complete`, {
    method: "PATCH",
    body: JSON.stringify({ orderNumber }),
  });
}

export function openScoutDegree(scoutDegreeId: string) {
  return apiClient<ScoutDegree>(`/scout-degrees/${scoutDegreeId}/open`, {
    method: "PATCH",
  });
}

export function deleteScoutDegree(scoutDegreeId: string) {
  return apiClient<void>(`/scout-degrees/${scoutDegreeId}`, {
    method: "DELETE",
  });
}
