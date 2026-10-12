import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card.tsx";
import { usePermission } from "@/hooks";
import { DeleteTroopModal } from "@/pages/DashboardPage/DeleteTroopModal.tsx";
import type { TroopDTO } from "@harcapp/types";

export function TroopCard({ troop }: { troop: TroopDTO }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const { isAdmin } = usePermission();

  return (
    <Card
      key={troop.id}
      className="flex flex-col justify-between border-border bg-card"
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 pr-2">
          <CardTitle className="text-xl text-primary">{troop.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {troop.description || t("dashboard.noDescription")}
          </CardDescription>
        </div>
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title={t("dashboard.deleteTroop")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 p-2.5 rounded-md">
          <span>
            {t("dashboard.members", { count: troop.memberCount ?? 0 })}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/troop/${troop.id}`)}
        >
          {t("dashboard.viewDetails")}
        </Button>
      </CardFooter>

      <DeleteTroopModal troop={troop} isOpen={isOpen} setIsOpen={setIsOpen} />
    </Card>
  );
}
