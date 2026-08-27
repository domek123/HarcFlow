import { useState } from "react";

import { supabase } from "@/lib/supabase.ts";
import { useTroopMembersList } from "@harcapp/api";

export type SortByOptions = "function" | "rank" | "degree" | "none";

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
      const valA = a[sortBy] || "";
      const valB = b[sortBy] || "";
      return valA.localeCompare(valB);
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
