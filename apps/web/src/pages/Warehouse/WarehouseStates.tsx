import { PackageOpen, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-3 text-center">
      <RotateCcw className="size-5 text-destructive" />
      <p className="text-sm text-destructive">{t("warehouse.common.error")}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        {t("warehouse.common.retry")}
      </Button>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
      <PackageOpen className="size-7 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
