import { Degree } from "@prisma/client";

export interface DegreeTemplate {
  id: string;
  degree: Degree;
  tasks: DegreeTemplateTask[];
}

export interface DegreeTemplateTask {
  id?: string;
  description: string;
  position: number;
}

export interface CreateDegreeTemplateInput {
  degree: Degree;
  tasks: Pick<DegreeTemplateTask, "description">[];
}

export interface UpdateDegreeTemplateInput {
  tasks: Omit<DegreeTemplateTask, "position">[];
}
