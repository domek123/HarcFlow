import type {
  Rank,
  Degree,
  Function,
  Gender,
  AttendanceStatus,
  BadgeStatus,
  Role,
} from "@prisma/client";
import { PatrolDTO } from "./patrol";

export interface RawTroopMemberAttendance {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  attendance: {
    status: AttendanceStatus;
  }[];
}

export interface TroopMemberAttendanceDTO {
  id: string;
  firstName: string;
  lastName: string;
  status: AttendanceStatus | null;
}
export interface TroopMemberSectionDTO {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  rank: Rank;
  degree: Degree;
  function: Function;
  patrolId: string | null;
}

export interface ScoutProfileDTO {
  id: string;
  userId: string;
  role: Role;
  firstName: string;
  lastName: string;
  troopId: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender: Gender;
  rank: Rank;
  degree: Degree;
  acquiringDegree: Degree;
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

export interface RawScoutProfile {
  id: string;
  userId: string;
  rank: Rank;
  degree: Degree;
  acquiringDegree: Degree;
  troopId: string;
  patrolId?: string | null;
  function: Function;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    birthDate?: string;
    gender?: "MALE" | "FEMALE";
    role: Role;
  };
  patrol?: PatrolDTO;
}

export interface RawScoutProfileDevelopmentDTO {
  id: string;
  rank: Rank;
  degree: Degree;
  acquiringDegree: Degree;
  user: {
    lastName: string;
    firstName: string;
    birthDate: string;
  };
  badges: {
    badgeId: string;
    status: BadgeStatus;
  }[];
}

export interface ScoutProfileDevelopmentDTO {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  rank: Rank;
  degree: Degree;
  acquiringDegree: Degree;
  badges: {
    badgeId: string;
    status: BadgeStatus;
  }[];
}
