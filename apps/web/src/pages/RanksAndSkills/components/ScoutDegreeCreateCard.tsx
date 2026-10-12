import { FilePlus2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEGREE_RANK, type Degree, type DegreeTemplate } from "@harcapp/types";

type Props = {
  templates: DegreeTemplate[];
  templateId: string;
  pending: boolean;
  memberDegree: Degree;
  onTemplateChange: (templateId: string) => void;
  onCreate: () => void;
};

export function ScoutDegreeCreateCard({
  templates,
  templateId,
  pending,
  onTemplateChange,
  onCreate,
  memberDegree,
}: Props) {
  const { t } = useTranslation();
  const selectedTemplate = templates.find(
    (template) => template.id === templateId,
  );

  const availableTemplates = templates.filter(
    (template) =>
      template.isActive !== false &&
      DEGREE_RANK[template.degree] >= DEGREE_RANK[memberDegree] + 1,
  );

  if (availableTemplates.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden p-0">
      <CardHeader className="border-b bg-muted/20 pt-4 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FilePlus2 className="size-4" />
          </span>
          <CardTitle className="text-base">
            {t("ranksAndSkills.createTrial.title")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={templateId}
            onValueChange={(value) => onTemplateChange(value ?? "")}
          >
            <SelectTrigger
              className="w-full sm:flex-1"
              aria-label={t("ranksAndSkills.createTrial.selectDegree")}
            >
              <SelectValue
                placeholder={t("ranksAndSkills.createTrial.selectDegree")}
              >
                {selectedTemplate
                  ? t(
                      `enums.degree.${selectedTemplate.degree}`,
                      selectedTemplate.degree,
                    )
                  : t("ranksAndSkills.createTrial.selectDegree")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {t(`enums.degree.${template.degree}`, template.degree)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="sm:min-w-36"
            disabled={!templateId || pending}
            onClick={onCreate}
          >
            <Plus className="size-4" />
            {t("ranksAndSkills.createTrial.addTrial")}
          </Button>
        </div>
        {selectedTemplate && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>
              {t("ranksAndSkills.createTrial.taskCount", {
                count: selectedTemplate.tasks.length,
              })}
            </span>
            {selectedTemplate.description && (
              <span className="truncate">{selectedTemplate.description}</span>
            )}
          </div>
        )}
        {availableTemplates.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t("ranksAndSkills.createTrial.noTemplates")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
