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
    <Card className="border-dashed bg-card/70">
      <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FilePlus2 className="size-7" />
        </span>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            {t("degreeTemplates.empty.title")}
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
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
