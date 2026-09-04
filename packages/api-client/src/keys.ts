export const troopsKeys = {
  all: ["scout-troops"] as const,
  lists: () => [...troopsKeys.all, "list"] as const,
  details: () => [...troopsKeys.all, "details"] as const,
  detail: (id?: string) =>
    id ? ([...troopsKeys.details(), id] as const) : troopsKeys.details(),
  patrols: (id?: string) =>
    id
      ? ([...troopsKeys.detail(id), "patrols"] as const)
      : ([...troopsKeys.details()] as const),
};

export const patrolsKeys = {
  troop: (troopId?: string) => ["patrols", troopId],
};

export const troopMembersKeys = {
  all: ["scout-troop-members"] as const,
  list: (troopId?: string) => [...troopMembersKeys.all, troopId] as const,
  single: (profileId?: string) => [...troopMembersKeys.all, profileId] as const,
};

export const parentsKeys = {
  all: ["scout-parents"] as const,
  single: (profileId?: string) => [...parentsKeys.all, profileId] as const,
};

export const scoutNotesKeys = {
  all: ["scout-notes"] as const,
  list: (profileId?: string) => [...scoutNotesKeys.all, profileId] as const,
};

export const scoutBadgesKeys = {
  all: ["scout-badges"] as const,
  list: (troopId?: string) => [...scoutBadgesKeys.all, troopId] as const,
};

export const scoutInventoryKeys = {
  all: ["scout-inventory"] as const,
  list: (troopId?: string) => [...scoutInventoryKeys.all, troopId] as const,
};
