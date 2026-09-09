import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button.tsx";
import { useLogout } from "@/hooks";
import { supabase } from "@/lib/supabase.ts";
import { AddTroopModal } from "@/pages/DashboardPage/AddTroopModal.tsx";
import { TroopCard } from "@/pages/DashboardPage/TroopCard.tsx";
import { useTroops } from "@harcapp/api-client";
import type { TroopDTO } from "@harcapp/types";

export function DashboardPage() {
  const { t } = useTranslation();

  const { data: troops, isLoading, isError, error } = useTroops(supabase);

  const { handleLogout, isLoggingOut, logoutError } = useLogout();

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Nagłówek i Przycisk Dodawania */}
        <div className="flex justify-between items-center border-b border-border pb-5">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {t("dashboard.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.description")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AddTroopModal />
            <Button
              variant="outline"
              className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut aria-hidden="true" />
              {isLoggingOut ? t("dashboard.loggingOut") : t("dashboard.logout")}
            </Button>
          </div>
        </div>

        {logoutError && (
          <p className="text-sm text-destructive">
            {t("dashboard.logoutError", { message: logoutError })}
          </p>
        )}

        {/* Sekcja stanu ładowania i błędów pobierania */}
        {isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            {t("dashboard.loadingTroops")}
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-destructive">
            {t("dashboard.errorLoadingTroops", {
              message: (error as Error).message,
            })}
          </div>
        )}

        {/* Siatka Kart Drużyn */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!troops || troops.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {t("dashboard.noTroops")}
              </div>
            ) : (
              troops.map((troop: TroopDTO) => (
                <TroopCard key={troop.id} troop={troop} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
