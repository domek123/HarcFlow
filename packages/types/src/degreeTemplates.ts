import {
  Degree,
  ScoutDegreeStatus,
  ScoutDegreeTaskSource,
  ScoutDegreeTaskStatus,
} from "@prisma/client";

export interface DegreeTemplate {
  id: string;
  degree: Degree;
  description?: string | null;
  isActive?: boolean;
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

export interface ScoutDegreeTask {
  id: string;
  scoutDegreeId: string;
  templateTaskId?: string | null;
  description?: string | null;
  position: number;
  source: ScoutDegreeTaskSource;
  status: ScoutDegreeTaskStatus;
}

export interface ScoutDegree {
  id: string;
  scoutId: string;
  degreeId: string;
  status: ScoutDegreeStatus;
  orderNumber?: string | null;
  startedAt: string;
  completedAt?: string | null;
  degree: Pick<DegreeTemplate, "id" | "degree" | "description">;
  tasks: ScoutDegreeTask[];
}
