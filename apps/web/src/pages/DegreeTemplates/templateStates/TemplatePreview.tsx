import { ClipboardCheck, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Degree, DegreeTemplate } from "@harcapp/types";

type TemplatePreviewProps = {
  degree: Degree;
  template: DegreeTemplate;
  onEdit: () => void;
};

export function TemplatePreview({
  degree,
  template,
  onEdit,
}: TemplatePreviewProps) {
  const { t } = useTranslation();

  return (
    <Card className="gap-0 p-0 border-primary/15 shadow-md shadow-primary/5">
      <CardHeader className="border-b bg-primary/[0.035] gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardCheck className="size-5" />
          </span>
          <div>
            <CardTitle className="text-lg">
              {t(`enums.degree.${degree}`)}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {template.tasks.length} {t("degreeTemplates.preview.tasks")}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={onEdit}>
          <Pencil />
          {t("degreeTemplates.preview.edit")}
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <ul className="space-y-2.5">
          {template.tasks.map((task, index) => (
            <li
              key={task.id}
              className="flex items-start gap-3 rounded-xl border bg-muted/20 px-3 py-3 text-sm transition-colors hover:bg-muted/40"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span className="pt-1 leading-relaxed">{task.description}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
