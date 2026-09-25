export interface ScoutYearDTO {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface ScoutYearWithCurrentFlagDTO extends ScoutYearDTO {
  isCurrent: boolean;
}

export interface CreateScoutYearPayload {
  name: string;
  startDate: string;
  endDate: string;
}
