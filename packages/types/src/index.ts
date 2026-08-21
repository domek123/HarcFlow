import type { Rank, Degree, Function } from '@prisma/client';

export type { Rank, Degree, Function };

export type BadgeStatus = 'PLANNED' | 'OPENED' | 'CLOSED';

export interface ScoutProfileDTO {
  id: string;
  firstName: string;
  lastName: string;
  rank: Rank;
  degree: Degree;
  function: Function;
  troopName: string;
  patrolName?: string;
  hasNaramiennik: boolean;
}

export interface TroopDTO {
  id: string;
  name: string;
  description?: string;
  patrolCount: number;
  memberCount: number;
}

export interface MeritBadgeDTO {
  id: string;
  name: string;
  level: number;
  status: BadgeStatus;
}

export interface CreateScoutInput {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  troopId: string;
}