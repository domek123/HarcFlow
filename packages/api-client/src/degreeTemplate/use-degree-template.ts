import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateDegreeTemplateInput,
  DegreeTemplate,
  UpdateDegreeTemplateInput,
} from "@harcapp/types";
import {
  createDegreeTemplate,
  fetchDegreeTemplates,
  updateDegreeTemplate,
} from "./degree-template.api";

export const degreeTemplateKeys = {
  all: ["degree-templates"] as const,

  lists: () => [...degreeTemplateKeys.all, "list"] as const,

  list: (troopId: string) => [...degreeTemplateKeys.lists(), troopId] as const,

  details: () => [...degreeTemplateKeys.all, "detail"] as const,

  detail: (troopId: string, templateId: string) =>
    [...degreeTemplateKeys.details(), troopId, templateId] as const,
};

export function useDegreeTemplates(troopId?: string) {
  return useQuery({
    queryKey: degreeTemplateKeys.list(troopId!),
    queryFn: () => fetchDegreeTemplates(troopId!),
    enabled: Boolean(troopId),
  });
}

export function useCreateDegreeTemplate(troopId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: CreateDegreeTemplateInput) =>
      createDegreeTemplate(troopId, template),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: degreeTemplateKeys.list(troopId),
      });
    },
  });
}

export function useUpdateDegreeTemplate(troopId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      template,
    }: {
      templateId: string;
      template: UpdateDegreeTemplateInput;
    }) => updateDegreeTemplate(troopId, templateId, template),

    onSuccess: async (updatedTemplate) => {
      queryClient.setQueryData<DegreeTemplate[]>(
        degreeTemplateKeys.list(troopId),
        (previous) =>
          previous?.map((template) =>
            template.id === updatedTemplate.id ? updatedTemplate : template,
          ),
      );

      await queryClient.invalidateQueries({
        queryKey: degreeTemplateKeys.list(troopId),
      });
    },
  });
}
