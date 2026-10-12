import { GripVertical, ListChecks, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Degree, type DegreeTemplateTask } from "@harcapp/types";

type TemplateEditorProps = {
  degree: Degree;
  tasks: DegreeTemplateTask[];
  isCreating: boolean;
  onChange: (form: DegreeTemplateTask[]) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function TemplateEditor({
  degree,
  tasks,
  isCreating,
  onChange,
  onCancel,
  onSave,
}: TemplateEditorProps) {
  const { t } = useTranslation();

  const updateTask = (taskId: string, description: string) => {
    onChange(
      tasks.map((task) =>
        task.id === taskId ? { ...task, description } : task,
      ),
    );
  };

  const addTask = () => {
    onChange([
      ...tasks,
      {
        id: `task-${Date.now()}`,
        description: "",
        position: tasks.length,
      },
    ]);
  };

  const removeTask = (taskId: string) => {
    onChange(
      tasks
        .filter((task) => task.id !== taskId)
        .map((task, index) => ({
          ...task,
          position: index,
        })),
    );
  };

  const reorderTasks = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    const sourceIndex = tasks.findIndex((task) => task.id === sourceId);

    const targetIndex = tasks.findIndex((task) => task.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const reorderedTasks = [...tasks];

    const [movedTask] = reorderedTasks.splice(sourceIndex, 1);

    reorderedTasks.splice(targetIndex, 0, movedTask);

    onChange(
      reorderedTasks.map((task, index) => ({
        ...task,
        position: index,
      })),
    );
  };

  return (
    <Card className="gap-0 p-0 border-primary/15 shadow-md shadow-primary/5">
      <CardHeader className="border-b bg-primary/[0.035] pt-5 pb-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ListChecks className="size-5" />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-lg">
              {isCreating
                ? t("degreeTemplates.editor.newTitle")
                : t("degreeTemplates.editor.editTitle")}
            </CardTitle>
            <CardDescription className="mt-1 font-medium">
              {t(`enums.degree.${degree}`)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-semibold">
                {t("degreeTemplates.editor.tasks")} ({tasks.length})
              </Label>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTask}
              >
                <Plus />
                {t("degreeTemplates.editor.addTask")}
              </Button>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-2 rounded-xl border bg-background p-2 shadow-sm transition-colors hover:border-primary/30"
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();

                    reorderTasks(
                      event.dataTransfer.getData("text/plain"),
                      task.id!,
                    );
                  }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", task.id!);
                    }}
                    aria-label={t("degreeTemplates.editor.dragTask", {
                      number: index + 1,
                    })}
                    title={t("degreeTemplates.editor.dragTask", {
                      number: index + 1,
                    })}
                  >
                    <GripVertical />
                  </Button>

                  <span className="hidden size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground sm:flex">
                    {index + 1}
                  </span>

                  <Input
                    className="border-0 bg-transparent shadow-none focus-visible:ring-1"
                    value={task.description ?? ""}
                    onChange={(event) =>
                      updateTask(task.id!, event.target.value)
                    }
                    placeholder={t("degreeTemplates.editor.taskPlaceholder", {
                      number: index + 1,
                    })}
                    aria-label={t("degreeTemplates.editor.taskPlaceholder", {
                      number: index + 1,
                    })}
                    required
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground opacity-70 transition-opacity hover:text-destructive group-hover:opacity-100"
                    onClick={() => removeTask(task.id!)}
                    aria-label={t("degreeTemplates.editor.removeTask", {
                      number: index + 1,
                    })}
                    title={t("degreeTemplates.editor.removeTask", {
                      number: index + 1,
                    })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("degreeTemplates.editor.cancel")}
            </Button>

            <Button type="submit">{t("degreeTemplates.editor.save")}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
