import { FilePlus2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TemplateEmptyStateProps = {
  onCreate: () => void;
};

export function TemplateEmpty({ onCreate }: TemplateEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
        <FilePlus2 className="size-10 text-muted-foreground" />
        <div className="space-y-1">
          <h2 className="font-semibold">{t("degreeTemplates.empty.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("degreeTemplates.empty.description")}
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus />
          {t("degreeTemplates.empty.add")}
        </Button>
      </CardContent>
    </Card>
  );
}
