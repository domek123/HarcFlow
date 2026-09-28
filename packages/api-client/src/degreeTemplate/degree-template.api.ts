import {
  CreateDegreeTemplateInput,
  DegreeTemplate,
  UpdateDegreeTemplateInput,
} from "@harcapp/types";
import { apiClient } from "../api";

export async function fetchDegreeTemplates(
  troopId: string,
): Promise<DegreeTemplate[]> {
  return apiClient<DegreeTemplate[]>(`/troops/${troopId}/degree-templates`, {
    method: "GET",
  });
}

export async function createDegreeTemplate(
  troopId: string,
  template: CreateDegreeTemplateInput,
): Promise<DegreeTemplate> {
  return apiClient<DegreeTemplate>(`/troops/${troopId}/degree-templates`, {
    method: "POST",
    body: JSON.stringify(template),
  });
}

export async function updateDegreeTemplate(
  troopId: string,
  templateId: string,
  template: UpdateDegreeTemplateInput,
): Promise<DegreeTemplate> {
  return apiClient<DegreeTemplate>(
    `/troops/${troopId}/degree-templates/${templateId}`,
    {
      method: "PATCH",
      body: JSON.stringify(template),
    },
  );
}
