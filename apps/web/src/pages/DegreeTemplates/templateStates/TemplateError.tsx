import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";

type TemplateErrorStateProps = {
  onRetry: () => void;
};

export function TemplateError({ onRetry }: TemplateErrorStateProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-destructive/20 bg-destructive/2">
      <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <RotateCcw className="size-6" />
        </span>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            {t("degreeTemplates.error.title")}
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("degreeTemplates.error.description")}
          </p>
        </div>
        <Button variant="outline" onClick={onRetry}>
          <RotateCcw />
          {t("degreeTemplates.error.retry")}
        </Button>
      </CardContent>
    </Card>
  );
}
