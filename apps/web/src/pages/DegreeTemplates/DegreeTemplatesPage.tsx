import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  useCreateDegreeTemplate,
  useDegreeTemplates,
  useUpdateDegreeTemplate,
} from "@harcapp/api-client";
import { Degree, type DegreeTemplateTask } from "@harcapp/types";

import { TemplateEditor } from "./TemplateEditor";
import { TemplateSelector } from "./TemplateSelector";
import { TemplateEmpty } from "./templateStates/TemplateEmpty";
import { TemplateError } from "./templateStates/TemplateError";
import { TemplatePreview } from "./templateStates/TemplatePreview";

export function DegreeTemplatesPage() {
  const { t } = useTranslation();

  const { id: troopId } = useParams<{
    id: string;
  }>();

  const [selectedDegree, setSelectedDegree] = useState<Degree>(Degree.DH);

  const [isEditing, setIsEditing] = useState(false);

  const [tasks, setTasks] = useState<DegreeTemplateTask[]>([]);

  const {
    data: templates = [],
    isPending,
    isError,
    refetch,
  } = useDegreeTemplates(troopId ?? "");
  const { mutateAsync: createDegreeTemplate } = useCreateDegreeTemplate(
    troopId ?? "",
  );
  const { mutateAsync: updateDegreeTemplate } = useUpdateDegreeTemplate(
    troopId ?? "",
  );

  const selectedTemplate = templates.find(
    (template) => template.degree === selectedDegree,
  );

  const isCreating = !selectedTemplate;

  const selectDegree = (degree: Degree) => {
    const template = templates.find((template) => template.degree === degree);

    setSelectedDegree(degree);
    setIsEditing(false);
    setTasks(template?.tasks ?? []);
  };

  const startEditing = () => {
    if (!troopId) return;

    setTasks(selectedTemplate?.tasks ?? []);

    setIsEditing(true);
  };

  const cancelEditing = () => {
    setTasks(selectedTemplate?.tasks ?? []);
    setIsEditing(false);
  };

  const saveTemplate = () => {
    if (!tasks || !troopId) return;

    const saveForm = isCreating
      ? createDegreeTemplate({
          degree: selectedDegree,
          tasks: tasks.map((task) => ({
            description: task.description,
          })),
        })
      : updateDegreeTemplate({
          templateId: selectedTemplate.id,
          template: {
            tasks: tasks.map((task) => ({
              id: task.id!.startsWith("task") ? undefined : task.id,
              description: task.description,
            })),
          },
        });

    toast.promise(saveForm, {
      success: () => {
        setIsEditing(false);
        return isCreating
          ? t("degreeTemplates.editor.createSuccess")
          : t("degreeTemplates.editor.updateSuccess");
      },
      error: () => {
        return isCreating
          ? t("degreeTemplates.editor.createError")
          : t("degreeTemplates.editor.updateError");
      },
    });
  };

  if (!troopId) {
    return null;
  }

  if (isPending) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("degreeTemplates.title")}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {t("degreeTemplates.description")}
          </p>
        </div>

        <TemplateSelector
          selectedDegree={selectedDegree}
          onSelect={selectDegree}
        />

        <div className="text-sm text-muted-foreground">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {t("degreeTemplates.selectorLabel")}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("degreeTemplates.title")}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("degreeTemplates.description")}
        </p>
      </div>

      <TemplateSelector
        selectedDegree={selectedDegree}
        onSelect={selectDegree}
      />

      {isError ? (
        <TemplateError onRetry={() => refetch()} />
      ) : isEditing && tasks ? (
        <TemplateEditor
          degree={selectedDegree}
          tasks={tasks}
          isCreating={isCreating}
          onChange={setTasks}
          onCancel={cancelEditing}
          onSave={saveTemplate}
        />
      ) : selectedTemplate ? (
        <TemplatePreview
          degree={selectedDegree}
          template={selectedTemplate}
          onEdit={startEditing}
        />
      ) : (
        <TemplateEmpty onCreate={startEditing} />
      )}
    </div>
  );
}
