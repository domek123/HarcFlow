import { PatrolDTO } from "./patrol";

export interface TroopDTO {
  id: string;
  name: string;
  description?: string;
  creationYear: number;
  memberCount: number;
}

export interface TroopWithPatrolsDTO {
  id: string;
  name: string;
  memberCount: number;
  patrols: PatrolDTO[];
}
