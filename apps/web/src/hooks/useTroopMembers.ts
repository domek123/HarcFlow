import { useState } from "react";

import { supabase } from "@/lib/supabase.ts";
import { useTroopMembersList } from "@harcapp/api-client";

export type SortByOptions = "function" | "rank" | "degree" | "none";

const FUNCTION_ORDER: Record<string, number> = {
  DRUZYNOWY: 1,
  PRZYBOCZNY: 2,
  ZASTEPOWY: 3,
  PODZASTEPOWY: 4,
  NONE: 5,
};

const RANK_ORDER: Record<string, number> = {
  HARCMISTRZ: 1,
  PODHARCMISTRZ: 2,
  PRZEWODNIK: 3,
  NONE: 4,
};

const DEGREE_ORDER: Record<string, number> = {
  HR: 1,
  HO: 2,
  CW: 3,
  WYW: 4,
  ML: 5,
  DH: 6,
  NONE: 7,
};

const ORDER_MAPS: Record<
  Exclude<SortByOptions, "none">,
  Record<string, number>
> = {
  function: FUNCTION_ORDER,
  rank: RANK_ORDER,
  degree: DEGREE_ORDER,
};

export function useTroopMembers(troopId?: string) {
  const { data, isLoading } = useTroopMembersList(supabase, troopId);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortByOptions>("none");

  const rawMembers = data || [];

  const filteredMembers = rawMembers
    .filter((m) => {
      const query = search.toLowerCase();
      return (
        m.firstName.toLowerCase().includes(query) ||
        m.lastName.toLowerCase().includes(query) ||
        (m.email && m.email.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      if (sortBy === "none") return 0;

      const orderMap = ORDER_MAPS[sortBy];

      const weightA = orderMap[a[sortBy] as string] ?? 99;
      const weightB = orderMap[b[sortBy] as string] ?? 99;

      return weightA - weightB;
    });

  return {
    members: filteredMembers,
    totalCount: filteredMembers.length,
    search,
    setSearch,
    sortBy,
    setSortBy,
    isLoading,
  };
}
