import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useChildrenContacts, useParentsContacts } from "@harcapp/api-client";

import { supabase } from "@/lib/supabase";
import type { ChildContact, ParentContact } from "../types";
import { normalizeEmail } from "../utils";

export function useContactsPage() {
  const { id: troopId } = useParams<{ id: string }>();

  const childrenQuery = useChildrenContacts(supabase, troopId ?? "");
  const parentsQuery = useParentsContacts(supabase, troopId ?? "");

  const children = (childrenQuery.data ?? []) as ChildContact[];
  const parents = (parentsQuery.data ?? []) as ParentContact[];

  const [search, setSearch] = useState("");

  const filteredChildren = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return children;
    return children.filter((child) =>
      [
        child.firstName,
        child.lastName,
        child.email ?? "",
        child.phoneNumber ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [children, search]);

  const filteredParents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return parents;
    return parents.filter((parent) =>
      [
        parent.firstName,
        parent.lastName,
        parent.email ?? "",
        parent.phoneNumber ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [parents, search]);

  return {
    children,
    parents,
    filteredChildren,
    filteredParents,
    parentsWithEmail: parents.filter((parent) => normalizeEmail(parent.email)),
    search,
    setSearch,
    isLoading: childrenQuery.isLoading || parentsQuery.isLoading,
    error: childrenQuery.error || parentsQuery.error,
  };
}
