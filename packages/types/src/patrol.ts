export interface PatrolDTO {
  id: string;
  name: string;
  assemblyDay: number;
  assemblyTime: string;
}

export interface CreatePatrolPayload {
  name: string;
  troopId: string;
}
