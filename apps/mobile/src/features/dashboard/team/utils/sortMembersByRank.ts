const rankOrder: Record<string, number> = {
  HARCMISTRZ: 3,
  PODHARCMISTRZ: 2,
  PRZEWODNIK: 1,
  NONE: 0,
};

const degreeOrder: Record<string, number> = {
  DH: 6,
  ML: 5,
  WYW: 4,
  CW: 3,
  HO: 2,
  HR: 1,
  NONE: 0,
};

const functionOrder: Record<string, number> = {
  DRUZYNOWY: 0,
  PRZYBOCZNY: 1,
  ZASTEPOWY: 2,
  PODZASTEPOWY: 3,
  NONE: 4,
};

export function sortMembersByRank<
  T extends {
    rank: string;
    function: string;
    degree?: string;
    firstName?: string;
    lastName?: string;
  },
>(items: T[]) {
  return [...items].sort((a, b) => {
    const functionDiff =
      (functionOrder[a.function] ?? 99) - (functionOrder[b.function] ?? 99);
    if (functionDiff !== 0) return functionDiff;

    const rankDiff = (rankOrder[b.rank] ?? 0) - (rankOrder[a.rank] ?? 0);
    if (rankDiff !== 0) return rankDiff;

    const degreeDiff =
      (degreeOrder[b.degree ?? "NONE"] ?? 0) -
      (degreeOrder[a.degree ?? "NONE"] ?? 0);
    if (degreeDiff !== 0) return degreeDiff;

    return `${a.firstName ?? ""} ${a.lastName ?? ""}`.localeCompare(
      `${b.firstName ?? ""} ${b.lastName ?? ""}`,
    );
  });
}
