import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Degree, DegreeTemplate } from "@harcapp/types";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

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
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <CardTitle>{t(`enums.degree.${degree}`)}</CardTitle>
        <Button variant="outline" onClick={onEdit}>
          {t("degreeTemplates.preview.edit")}
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {template.tasks.map((task, index) => (
            <li
              key={task.id}
              className="rounded-md border bg-muted/30 px-4 py-3 text-sm"
            >
              <span className="mr-2 font-medium text-muted-foreground">
                {index + 1}.
              </span>
              {task.description}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
