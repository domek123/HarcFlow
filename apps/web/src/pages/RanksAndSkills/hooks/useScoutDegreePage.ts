import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import {
  useCreateScoutDegree,
  useCreateScoutDegreeTask,
  useCompleteScoutDegree,
  useDeleteScoutDegree,
  useDeleteScoutDegreeTask,
  useDegreeTemplates,
  useGetScoutsDevelopmentProfile,
  useOpenScoutDegree,
  useScoutDegrees,
  useUpdateScoutDegreeTask,
} from "@harcapp/api-client";
import type { ScoutDegreeTask, ScoutDegreeTaskStatus } from "@harcapp/types";

export function useScoutDegreePage() {
  const { t } = useTranslation();
  const { id: troopId, scoutId } = useParams<{ id: string; scoutId: string }>();
  const profileQuery = useGetScoutsDevelopmentProfile(supabase, troopId);
  const degreesQuery = useScoutDegrees(scoutId);
  const templatesQuery = useDegreeTemplates(troopId);
  const createDegree = useCreateScoutDegree(scoutId);
  const updateTask = useUpdateScoutDegreeTask(scoutId);
  const createTask = useCreateScoutDegreeTask(scoutId);
  const deleteTask = useDeleteScoutDegreeTask(scoutId);
  const completeDegree = useCompleteScoutDegree(scoutId);
  const deleteDegree = useDeleteScoutDegree(scoutId);
  const openDegree = useOpenScoutDegree(scoutId);
  const [selectedId, setSelectedId] = useState<string>();
  const [templateId, setTemplateId] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const degrees = degreesQuery.data ?? [];
  const member = profileQuery.data?.find((profile) => profile.id === scoutId);
  const activeDegree = degrees.find(
    (degree) =>
      degree.status !== "COMPLETED" &&
      degree.degree.degree === member?.acquiringDegree,
  );

  const selectedDegree =
    degrees.find((degree) => degree.id === selectedId) ??
    activeDegree ??
    degrees[0];
  const canEditSelectedDegree = selectedDegree?.status !== "COMPLETED";

  useEffect(() => {
    if (!templateId && member?.acquiringDegree) {
      const matchingTemplate = templatesQuery.data?.find(
        (template) =>
          template.degree === member.acquiringDegree &&
          template.isActive !== false,
      );
      if (matchingTemplate) setTemplateId(matchingTemplate.id);
    }
  }, [member?.acquiringDegree, templateId, templatesQuery.data]);

  const saveTask = (
    taskId: string,
    payload: Partial<Pick<ScoutDegreeTask, "description">>,
  ) =>
    toast.promise(updateTask.mutateAsync({ taskId, payload }), {
      success: t("ranksAndSkills.toasts.taskSaved"),
      error: t("ranksAndSkills.toasts.taskSaveError"),
    });

  const changeStatus = (taskId: string, status: ScoutDegreeTaskStatus) =>
    toast.promise(updateTask.mutateAsync({ taskId, payload: { status } }), {
      success: t("ranksAndSkills.toasts.taskStatusChanged"),
      error: t("ranksAndSkills.toasts.taskStatusChangeError"),
    });

  const startTrial = () => {
    if (!templateId) return;
    toast.promise(createDegree.mutateAsync(templateId), {
      success: t("ranksAndSkills.toasts.trialStarted"),
      error: t("ranksAndSkills.toasts.trialStartError"),
    });
  };

  const addIndividualTask = () => {
    if (!selectedDegree || !newDescription.trim()) return;
    toast.promise(
      createTask.mutateAsync({
        scoutDegreeId: selectedDegree.id,
        payload: {
          description: newDescription.trim(),
          position: selectedDegree.tasks.length,
        },
      }),
      {
        success: t("ranksAndSkills.toasts.individualTaskAdded"),
        error: t("ranksAndSkills.toasts.individualTaskAddError"),
      },
    );
    setNewDescription("");
  };

  return {
    degrees,
    activeDegree,
    selectedDegree,
    canEditSelectedDegree,
    templateId,
    setTemplateId,
    newDescription,
    setNewDescription,
    memberDegree: member?.degree ?? "NONE",
    memberName: member ? `${member.firstName} ${member.lastName}` : "",
    templates: templatesQuery.data ?? [],
    updateTaskPending: updateTask.isPending,
    completeDegreePending: completeDegree.isPending,
    deleteDegreePending: deleteDegree.isPending,
    createDegreePending: createDegree.isPending,
    createTaskPending: createTask.isPending,
    isLoading:
      degreesQuery.isLoading ||
      templatesQuery.isLoading ||
      profileQuery.isLoading,
    isError:
      degreesQuery.isError || templatesQuery.isError || profileQuery.isError,
    setSelectedId,
    startTrial,
    addIndividualTask,
    saveTask,
    changeStatus,
    deleteTask: (taskId: string) => deleteTask.mutate(taskId),
    deleteDegree: (degreeId: string) =>
      toast.promise(deleteDegree.mutateAsync(degreeId), {
        success: t("ranksAndSkills.toasts.trialDeleted"),
        error: t("ranksAndSkills.toasts.trialDeleteError"),
      }),
    openDegree: (degreeId: string) =>
      toast.promise(openDegree.mutateAsync(degreeId), {
        success: t("ranksAndSkills.toasts.trialOpened"),
        error: t("ranksAndSkills.toasts.trialOpenError"),
      }),
    completeDegree: (degreeId: string, orderNumber: string) =>
      toast.promise(
        completeDegree.mutateAsync({ scoutDegreeId: degreeId, orderNumber }),
        {
          success: t("ranksAndSkills.toasts.trialCompleted"),
          error: t("ranksAndSkills.toasts.trialCompleteError"),
        },
      ),
  };
}
