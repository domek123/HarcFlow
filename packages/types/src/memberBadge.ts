import { BadgeStatus } from "@prisma/client";

export interface RawScoutProfileWithBadges {
  id: string;
  user: {
    firstName?: string;
    lastName?: string;
  };
  badges: {
    badgeId: string;
    status: BadgeStatus;
  }[];
}

export interface ScoutProfileWithBadgesDTO {
  id: string;
  firstName: string;
  lastName: string;
  badges: {
    badgeId: string;
    status: BadgeStatus;
  }[];
}

export interface AssignBadgeInput {
  profileId: string;
  badgeId: string;
  status: BadgeStatus;
}
