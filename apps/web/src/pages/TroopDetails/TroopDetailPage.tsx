import { useState } from "react";

import { t } from "i18next";
import { ArrowLeft, Pencil } from "lucide-react";
import { Link, Outlet, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useTroopDetails } from "@harcapp/api-client";

import { EditTroopModal } from "./EditTroopModal";
import { TopNavigation } from "./TopNavigation";

export function TroopDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [isEditTroopModalOpen, setIsEditTroopModalOpen] = useState(false);
  const { data: troop, isLoading } = useTroopDetails(supabase, id);

  if (!troop || isLoading) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("troopDetails.backToList")}
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {troop.name}
            </CardTitle>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => setIsEditTroopModalOpen(true)}
          aria-label={t("troopDetails.editTroopModal.editButtonHover")}
          title={t("troopDetails.editTroopModal.editButtonHover")}
        >
          <Pencil className="size-4" />
        </Button>
      </div>

      <TopNavigation troopId={id} />
      <Outlet />

      <EditTroopModal
        isOpen={isEditTroopModalOpen}
        onOpenChange={setIsEditTroopModalOpen}
        troop={troop}
      />
    </div>
  );
}
