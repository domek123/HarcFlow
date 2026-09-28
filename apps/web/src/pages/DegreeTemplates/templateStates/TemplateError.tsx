import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

type TemplateErrorStateProps = {
  onRetry: () => void;
};

export function TemplateError({ onRetry }: TemplateErrorStateProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
        <RotateCcw className="size-8 text-destructive" />
        <div className="space-y-1">
          <h2 className="font-semibold">{t("degreeTemplates.error.title")}</h2>
          <p className="text-sm text-muted-foreground">
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
