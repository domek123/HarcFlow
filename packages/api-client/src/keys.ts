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
