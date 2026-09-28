// Keys to invalidate troop
export const troopsKeys = {
  all: ["scout-troops"] as const,
  // list of troops
  lists: () => [...troopsKeys.all, "list"] as const,
  details: () => [...troopsKeys.all, "details"] as const,
  //single troop
  detail: (id?: string) =>
    id ? ([...troopsKeys.details(), id] as const) : troopsKeys.details(),
  // with patrols
  patrols: (id?: string) =>
    id
      ? ([...troopsKeys.detail(id), "patrols"] as const)
      : ([...troopsKeys.details()] as const),
};

export const patrolsKeys = {
  // all troop's patrol
  troop: (troopId?: string) => ["patrols", troopId],
};

// Keys to invalidate troop members
export const troopMembersKeys = {
  all: ["scout-troop-members"] as const,
  // list of troop members
  list: (troopId?: string) => [...troopMembersKeys.all, troopId] as const,
  developmentProfile: (troopId?: string) =>
    [...troopMembersKeys.all, "developmentProfile", troopId] as const,
  // single troop member
  single: (profileId?: string) => [...troopMembersKeys.all, profileId] as const,
};

// Keys to invalidate scout's parents
export const parentsKeys = {
  all: ["scout-parents"] as const,
  // scout's parents
  single: (profileId?: string) => [...parentsKeys.all, profileId] as const,
};

// Keys to invalidate scout's badges
export const scoutNotesKeys = {
  all: ["scout-notes"] as const,
  // scout's notes
  list: (profileId?: string) => [...scoutNotesKeys.all, profileId] as const,
};

// Keys to invalidate troop badges
export const badgesKeys = {
  all: ["badges"] as const,
  // list of troop badges
  list: (troopId?: string) => [...badgesKeys.all, troopId] as const,
};

// Keys to invalidate scout's badges
export const scoutBadgeKeys = {
  all: ["scout-badges"] as const,
  // scout's badges
  list: (profileId?: string) => [...scoutBadgeKeys.all, profileId] as const,
};

// Keys to invalidate troop inventory
export const troopInventoryKeys = {
  all: ["troop-inventory"] as const,
  // list of troop inventory
  list: (troopId?: string) => [...troopInventoryKeys.all, troopId] as const,
};

// Keys to invalidate troop badges to buy
export const badgeToBuyKeys = {
  all: ["badgesToBuy"] as const,
  // list of troop badges to buy
  list: (troopId?: string) => [...badgeToBuyKeys.all, troopId] as const,
};

// Keys to invalidate troop events
export const eventKeys = {
  all: ["events"] as const,
  // list of troop events
  list: (troopId?: string) => [...eventKeys.all, "list", troopId] as const,
};

export const attendanceKeys = {
  all: ["attendances"] as const,
  statistics: (troopId?: string) =>
    [...attendanceKeys.all, "statistics", troopId] as const,
  // list of troop attendances
  list: (troopId?: string, eventId?: string) =>
    [...attendanceKeys.all, "list", troopId, eventId] as const,
};

export const scoutYearKeys = {
  all: ["scout-years"] as const,
  // list of scout years
  lists: () => [...scoutYearKeys.all, "list"] as const,
  current: () => [...scoutYearKeys.all, "current"] as const,
};

export const degreeTemplateKeys = {
  all: ["degree-templates"] as const,

  list: (troopId: string) =>
    [...degreeTemplateKeys.all, "list", troopId] as const,
};
