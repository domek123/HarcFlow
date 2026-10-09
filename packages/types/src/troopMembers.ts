import type {
  Rank,
  Degree,
  Function,
  Gender,
  AttendanceStatus,
  BadgeStatus,
  Role,
} from "@prisma/client";

import type { PatrolDTO } from "./patrol";

interface ScoutName {
  firstName: string;
  lastName: string;
}

interface ScoutIdentity extends ScoutName {
  id: string;
}

interface ScoutDegreeInfo {
  rank: Rank;
  degree: Degree;
  acquiringDegree: Degree;
}

export interface RawTroopMemberAttendance {
  id: string;
  user: ScoutName;
  attendance: {
    status: AttendanceStatus;
  }[];
}

export interface TroopMemberAttendanceDTO extends ScoutIdentity {
  status: AttendanceStatus | null;
}

export interface TroopMemberSectionDTO extends ScoutIdentity, ScoutDegreeInfo {
  birthDate: Date | null;
  function: Function;
  patrolId: string | null;
}

export interface ScoutProfileDTO extends ScoutDegreeInfo, ScoutIdentity {
  userId: string;
  role: Role;
  troopId: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender: Gender;
  function: Function;
  patrolId?: string | null;
  patrol?: PatrolDTO | null;
}

export interface CreateScoutInput {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  troopId: string;
}

export interface RawScoutProfile extends ScoutDegreeInfo {
  id: string;
  userId: string;
  troopId: string;
  function: Function;
  patrolId?: string | null;
  user?: Partial<ScoutName> & {
    email?: string;
    phoneNumber?: string;
    birthDate?: string;
    gender?: Gender;
    role: Role;
  };
  patrol?: PatrolDTO | null;
}

interface ScoutProfileDevelopmentBase extends ScoutDegreeInfo {
  id: string;
  badges: {
    badgeId: string;
    status: BadgeStatus;
  }[];
}

export interface RawScoutProfileDevelopmentDTO extends ScoutProfileDevelopmentBase {
  user: ScoutName & {
    birthDate: string;
  };
}

export interface ScoutProfileDevelopmentDTO extends ScoutProfileDevelopmentBase {
  firstName: string;
  lastName: string;
  birthDate: string;
}
